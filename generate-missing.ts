import { existsSync } from "fs";
import { spawn } from "child_process";

const script = "/Users/sherconan/.claude/skills/baoyu-danger-gemini-web/scripts/main.ts";

const missing = [
  { id: "heilongtan", image: "assets/images/dest-heilongtan.webp", prompt: "Cute kawaii cartoon: a dark mysterious waterfall pool in a mountain gorge, fireflies glowing, tiny explorer with flashlight, magical, no text" },
  { id: "jumahe", image: "assets/images/dest-jumahe.webp", prompt: "Cute kawaii cartoon: happy kids splashing in a clear river on a sunny summer day, colorful inner tubes floating, green mountains, no text" },
  { id: "guihuamu", image: "assets/images/dest-guihuamu.webp", prompt: "Cute kawaii cartoon: ancient petrified tree fossils in a rocky landscape, a curious child dinosaur examining them, educational fun, no text" },
  { id: "chengde-temples", image: "assets/images/dest-chengde-temples.webp", prompt: "Cute kawaii cartoon: a grand Tibetan-style red and gold temple on a hillside, prayer flags fluttering, mountains behind, no text" },
  { id: "ming-wall", image: "assets/images/dest-ming-wall.webp", prompt: "Cute kawaii cartoon: an ancient brick city wall with cherry blossom trees blooming, petals floating, a cat walking on top, spring morning, no text" },
  { id: "longqingxia-ice", image: "assets/images/dest-longqingxia-ice.webp", prompt: "Cute kawaii cartoon: colorful glowing ice sculptures in a frozen canyon at night, rainbow lights, a happy snowman, magical winter, no text" },
  { id: "simatai-wall", image: "assets/images/dest-simatai-wall.webp", prompt: "Cute kawaii cartoon: the Great Wall at night under stars, glowing lanterns on watchtowers, a tiny brave hiker with headlamp, moonlit, no text" },
  { id: "taihang-watertown", image: "assets/images/dest-taihang-watertown.webp", prompt: "Cute kawaii cartoon: a rustic mountain village at dusk with warm lanterns glowing, stone houses, red chili peppers drying, smoke from chimneys, cozy, no text" },
];

async function generate(t: typeof missing[0]): Promise<boolean> {
  return new Promise((resolve) => {
    const proc = spawn("bun", [script, "--prompt", t.prompt, "--image", t.image, "--model", "gemini-3.0-flash"], {
      cwd: "/Users/sherconan/weekend-go",
      timeout: 180000,
    });
    let err = "";
    proc.stderr.on("data", (d: Buffer) => { err += d.toString(); });
    proc.on("close", (code: number | null) => {
      if (code === 0 && existsSync(t.image)) resolve(true);
      else { if (err) console.error(`  ${err.slice(0, 100)}`); resolve(false); }
    });
    proc.on("error", () => resolve(false));
  });
}

async function main() {
  for (const t of missing) {
    if (existsSync(`/Users/sherconan/weekend-go/${t.image}`)) {
      console.log(`${t.id} ✅ already exists`);
      continue;
    }
    console.log(`${t.id}...`);
    let ok = await generate(t);
    if (!ok) { console.log("  retry..."); ok = await generate(t); }
    if (!ok) { console.log("  retry 2..."); ok = await generate(t); }
    console.log(ok ? `  ✅` : `  ❌`);
  }
  console.log("Done!");
}

main();
