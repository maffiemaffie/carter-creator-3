import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";

const ROOT = "src/assets/features";

const categories = await readdir(ROOT, { withFileTypes: true });

const allCombined = {};

for (const category of categories) {
  if (!category.isDirectory()) continue;

  const dirName = category.name;

  const dirPath = path.join(ROOT, dirName);

  const features = (await readdir(dirPath))
    .filter((feature) => feature.endsWith(".json"))
    .sort();

  const combined = [];

  for (const feature of features) {
    const json = JSON.parse(
      await readFile(path.join(dirPath, feature), "utf8"),
    );
    combined.push(json);
  }

  allCombined[dirName] = combined;

  console.log(`✓ Compiled ${dirName}/`)
}
const outPath = path.join(ROOT, "features.json");

await writeFile(outPath, JSON.stringify(allCombined, null, 2));

console.log(`✓ ${outPath}`);