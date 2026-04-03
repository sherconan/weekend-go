import { readFileSync, existsSync } from "fs";
import { spawn } from "child_process";

const batch = JSON.parse(readFileSync("batch-extra.json", "utf-8"));
const styleMd = readFileSync("prompts/style.md", "utf-8").trim();
const script = "/Users/sherconan/.claude/skills/baoyu-danger-gemini-web/scripts/main.ts";
const tasks: any[] = batch.tasks;

const pending = tasks.filter((t) => !existsSync(t.image));
console.log(`Total: ${tasks.length}, Already done: ${tasks.length - pending.length}, Pending: ${pending.length}`);

async function generate(t: any): Promise<boolean> {
  const fullPrompt = `${styleMd}\n\n${t.prompt}`;
  return new Promise((resolve) => {
    const proc = spawn("bun", [script, "--prompt", fullPrompt, "--image", t.image, "--model", "gemini-3.0-flash"], {
      cwd: "/Users/sherconan/weekend-go",
      timeout: 300000,
    });
    let err = "";
    proc.stderr.on("data", (d: Buffer) => { err += d.toString(); });
    proc.on("close", (code: number | null) => {
      if (code === 0 && existsSync(t.image)) resolve(true);
      else { if (err) console.error(`    ${err.slice(0, 150)}`); resolve(false); }
    });
    proc.on("error", (e: Error) => { console.error(`    ${e.message}`); resolve(false); });
  });
}

async function main() {
  let success = 0, fail = 0;
  for (let i = 0; i < pending.length; i++) {
    const t = pending[i];
    console.log(`\n[${i + 1}/${pending.length}] ${t.id}`);
    let ok = await generate(t);
    if (!ok) { console.log(`  Retry...`); ok = await generate(t); }
    if (!ok) { console.log(`  Retry 2...`); ok = await generate(t); }
    if (ok) { success++; console.log(`  ✅`); }
    else { fail++; console.log(`  ❌`); }
  }
  const total = tasks.filter((t) => existsSync(t.image)).length;
  console.log(`\n🎉 Done! ${total}/${tasks.length} (${success} new, ${fail} failed)`);
}

main();
