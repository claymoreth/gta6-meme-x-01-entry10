// Entry point for the gta6-meme-x-01 towing entry.
// It hands the posted X link to the grader: read POST.json, check that it
// names a real public status, copy it to /output, and prove the copy is exact.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const postPath = join(process.cwd(), "POST.json");
const raw = readFileSync(postPath, "utf8");
const post = JSON.parse(raw);

const link = typeof post?.url === "string" ? post.url.trim() : "";
const m = /^https:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/([A-Za-z0-9_]+)\/status\/(\d+)\/?$/.exec(link);
if (!m) {
  throw new Error("POST.json must hold a status URL like https://x.com/<handle>/status/<id>");
}
const [, handle, statusId] = m;
if (handle.toLowerCase() !== "claymorely") {
  throw new Error(`expected the post to be by @claymorely, got @${handle}`);
}

mkdirSync(outDir, { recursive: true });
const target = join(outDir, "POST.json");
writeFileSync(target, raw);
const back = readFileSync(target, "utf8");
if (back !== raw) {
  throw new Error("the copy in /output does not match POST.json byte for byte");
}
if (Buffer.byteLength(back, "utf8") !== Buffer.byteLength(raw, "utf8")) {
  throw new Error("the copy in /output has a different byte length than POST.json");
}
console.log(`handed in ${link} (status ${statusId} by @${handle})`);
