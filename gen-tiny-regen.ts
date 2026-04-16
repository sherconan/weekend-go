import { existsSync, readFileSync, statSync, unlinkSync } from "fs";
import { spawn, execSync } from "child_process";

const ROOT = "/Users/sherconan/weekend-go";
const SKILL = "/Users/sherconan/.claude/skills/baoyu-danger-gemini-web/scripts/main.ts";
const queue: { file: string; name: string; prompt: string; city: string }[] = JSON.parse(
  readFileSync(`${ROOT}/tiny-regen-queue.json`, "utf-8")
);

const args = process.argv.slice(2);
const start = args.indexOf("--start") >= 0 ? +args[args.indexOf("--start") + 1] : 0;
const limit = args.indexOf("--limit") >= 0 ? +args[args.indexOf("--limit") + 1] : queue.length;
const testOnly = args.includes("--test");
const onlyPrimitive = args.includes("--only-primitive");
const delayMs = 5000;

function callSkill(prompt: string, pngTmp: string): Promise<{ code: number | null; stderr: string }> {
  return new Promise((resolve) => {
    const proc = spawn(
      "bun",
      [SKILL, "--prompt", prompt, "--image", pngTmp, "--model", "gemini-3-pro"],
      { cwd: "/tmp", stdio: ["ignore", "pipe", "pipe"] }
    );
    let stderr = "";
    let timedOut = false;
    proc.stderr.on("data", (d) => (stderr += d.toString()));
    const killer = setTimeout(() => {
      timedOut = true;
      try { proc.kill("SIGKILL"); } catch {}
    }, 240000);
    proc.on("close", (code) => {
      clearTimeout(killer);
      resolve({ code, stderr: stderr + (timedOut ? "\n[WRAPPER_TIMEOUT_240s]" : "") });
    });
    proc.on("error", (e) => { clearTimeout(killer); resolve({ code: -1, stderr: e.message }); });
  });
}

async function genOne(item: typeof queue[0], idx: number): Promise<boolean> {
  const pngTmp = `/tmp/pr-${item.file.replace(/\.webp$/, "")}.png`;
  const webpOut = `${ROOT}/assets/images/${item.file}`;
  const pbPath = `${ROOT}/assets/images-tiny-backup/${item.file}`;

  if (onlyPrimitive && existsSync(webpOut) && existsSync(pbPath)) {
    if (statSync(webpOut).size !== statSync(pbPath).size) {
      console.log(`[${idx + 1}/${queue.length}] skip (already regenerated) ${item.file}`);
      return true;
    }
  }

  const MAX_ATTEMPTS = 3;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    if (existsSync(pngTmp)) unlinkSync(pngTmp);
    const stronger = attempt === 1
      ? "landscape 16:9 horizontal wide format, widescreen aspect ratio"
      : "LANDSCAPE PANORAMIC 16:9 widescreen horizontal only, NEVER vertical or portrait. Wide cinematic travel poster format. The image must be WIDER than it is TALL. Horizontal composition spanning left to right";
    const landscapePrompt = `${item.prompt} [STRICT FORMAT: ${stronger}]`;
    const { code, stderr } = await callSkill(landscapePrompt, pngTmp);
    const size = existsSync(pngTmp) ? statSync(pngTmp).size : 0;
    if (size < 50000) {
      const authFail = /AuthError|Failed to refresh cookies|401/.test(stderr);
      if (authFail) {
        console.log(`[${idx + 1}/${queue.length}] 🔑 auth expired, refreshing cookies from main Chrome...`);
        try {
          const r = execSync(`python3 "${ROOT}/refresh-gemini-cookies.py"`, { encoding: "utf8" });
          console.log(`  ${r.trim()}`);
          await new Promise((res) => setTimeout(res, 3000));
        } catch (e: any) {
          console.log(`  ❌ refresh failed: ${e.message}`);
        }
      }
      console.log(`[${idx + 1}/${queue.length}] ⚠️ attempt ${attempt} gen-fail: ${item.file} code=${code} size=${size}${stderr.trim() ? " err=" + stderr.trim().slice(0, 100) : ""}`);
      if (attempt < MAX_ATTEMPTS) await new Promise((r) => setTimeout(r, 8000));
      continue;
    }
    const dims = execSync(`sips -g pixelWidth -g pixelHeight "${pngTmp}"`, { encoding: "utf8" });
    const w = +(dims.match(/pixelWidth:\s*(\d+)/)?.[1] || "0");
    const h = +(dims.match(/pixelHeight:\s*(\d+)/)?.[1] || "0");
    const aspect = w / h;
    if (aspect < 1.3) {
      console.log(`[${idx + 1}/${queue.length}] ⚠️ attempt ${attempt} wrong-aspect ${w}x${h} (${aspect.toFixed(2)}:1): ${item.file}`);
      unlinkSync(pngTmp);
      if (attempt < MAX_ATTEMPTS) await new Promise((r) => setTimeout(r, 6000));
      continue;
    }
    try {
      const targetAspect = 16 / 9;
      const currentAspect = w / h;
      let cropSrc = pngTmp;
      let outW = w, outH = h;
      if (Math.abs(currentAspect - targetAspect) > 0.05) {
        if (currentAspect > targetAspect) {
          outW = Math.round(h * targetAspect); outH = h;
        } else {
          outW = w; outH = Math.round(w / targetAspect);
        }
        execSync(`sips -c ${outH} ${outW} "${pngTmp}" --out "${pngTmp}.crop.png" >/dev/null 2>&1`);
        cropSrc = `${pngTmp}.crop.png`;
      }
      execSync(`cwebp -quiet -q 90 "${cropSrc}" -o "${webpOut}"`, { stdio: "pipe" });
      unlinkSync(pngTmp);
      if (cropSrc !== pngTmp) unlinkSync(cropSrc);
      const finalSize = statSync(webpOut).size;
      console.log(`[${idx + 1}/${queue.length}] ✅ ${item.name} → ${item.file} ${w}x${h}→${outW}x${outH} (${(finalSize / 1024).toFixed(0)}KB)${attempt > 1 ? ` [retry ${attempt}]` : ""}`);
      return true;
    } catch (e) {
      console.log(`[${idx + 1}/${queue.length}] ❌ sips/cwebp failed: ${e}`);
      return false;
    }
  }
  console.log(`[${idx + 1}/${queue.length}] ❌ ${item.name} (${item.file}) gave up after 2 attempts`);
  return false;
}

async function main() {
  const batch = queue.slice(start, start + limit);
  console.log(`Running ${batch.length} items, start=${start}, delay=${delayMs}ms`);
  let ok = 0, fail = 0;
  const failed: string[] = [];
  for (let i = 0; i < batch.length; i++) {
    const success = await genOne(batch[i], start + i);
    if (success) ok++;
    else {
      fail++;
      failed.push(batch[i].file);
      if (fail >= 3 && ok === 0) {
        console.log(`\n🛑 3 consecutive fails at start — auth likely broken. Aborting.`);
        break;
      }
    }
    if (testOnly) break;
    if (i < batch.length - 1) await new Promise((r) => setTimeout(r, delayMs));
  }
  console.log(`\n=== DONE === ok=${ok} fail=${fail}`);
  if (failed.length) console.log(`Failed: ${failed.join(", ")}`);
}

main();
