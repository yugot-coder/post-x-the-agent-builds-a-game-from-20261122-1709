// NEON DRIFT — entry program for make.fun's "The agent builds a game from
// one prompt" bounty (Node 22, standard library only).
//
// The entry itself is a post on X: a short video of an AI coding agent
// building the game in game.html from a single prompt, ending with
// make.fun's referral end card. This program's whole job is to hand the
// post's address to the gate: it copies POST.json from the repository
// root into the output directory, byte for byte, and nothing more.
//
// Outside the grader, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in
// for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outputDir, { recursive: true });

// Fail early with a clear message when POST.json is not the JSON object
// the gate expects, instead of handing it a file it would refuse anyway.
let post: unknown;
try {
  post = JSON.parse(readFileSync(join(botDir, "POST.json"), "utf8"));
} catch (err) {
  console.error(`POST.json in ${botDir} is not readable JSON: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof post !== "object" || post === null || typeof (post as { url?: unknown }).url !== "string") {
  console.error('POST.json must be a JSON object with a "url" string naming the post.');
  process.exit(1);
}

try {
  copyFileSync(join(botDir, "POST.json"), join(outputDir, "POST.json"));
} catch (err) {
  console.error(`could not copy POST.json from ${botDir}: ${(err as Error).message}`);
  process.exit(1);
}
