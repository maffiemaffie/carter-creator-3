import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";

const ROOT = "src/assets/features";

const entries = await readdir(ROOT, { withFileTypes: true });

for (const entry of entries) {
  if (!entry.isDirectory()) continue;

  const dirName = entry.name;

  if (dirName === "compiled") continue;

  const dirPath = path.join(ROOT, dirName);

  const files = (await readdir(dirPath))
    .filter((file) => file.endsWith(".json"))
    .sort();

  const combined = [];

  for (const file of files) {
    const json = JSON.parse(
      await readFile(path.join(dirPath, file), "utf8"),
    );
    combined.push(json);
  }

  const outPath = path.join(ROOT, `${dirName}.json`);

  await writeFile(outPath, JSON.stringify(combined, null, 2));

  console.log(`✓ ${outPath}`);
}