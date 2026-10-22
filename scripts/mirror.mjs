// Downloads CelesTrak orbital elements into gp/<group>.json (compact rows).
// Run by .github/workflows/orbit-data.yml every 2 hours; the files are
// published on the `data` branch and served to the app by GitHub's CDN.
//   node scripts/mirror.mjs <outDir> [fallbackDir]
import { mkdir, readFile, writeFile } from "node:fs/promises";

const GROUPS = ["stations", "science", "resource", "weather", "active"];
const [outDir = "gp", fallbackDir] = process.argv.slice(2);
await mkdir(outDir, { recursive: true });

const row = (o) => [
  o.NORAD_CAT_ID, o.OBJECT_NAME, o.OBJECT_ID, o.EPOCH, o.MEAN_MOTION, o.ECCENTRICITY,
  o.INCLINATION, o.RA_OF_ASC_NODE, o.ARG_OF_PERICENTER, o.MEAN_ANOMALY, o.BSTAR,
  o.MEAN_MOTION_DOT, o.MEAN_MOTION_DDOT, o.REV_AT_EPOCH,
];

let failures = 0;
for (const group of GROUPS) {
  const res = await fetch(`https://celestrak.org/NORAD/elements/gp.php?GROUP=${group}&FORMAT=json`, {
    headers: { "User-Agent": "Orbit tracker data mirror (whereisiss.com)" },
  });
  const text = await res.text();
  if (res.ok && text.trimStart().startsWith("[")) {
    const payload = { group, fetched: new Date().toISOString(), rows: JSON.parse(text).map(row) };
    await writeFile(`${outDir}/${group}.json`, JSON.stringify(payload));
    console.log(`${group}: ${payload.rows.length} objects`);
    continue;
  }
  // "Not updated since your last download": keep the previous file, it is current.
  console.log(`${group}: ${text.trim().slice(0, 120)}`);
  if (fallbackDir) {
    try {
      await writeFile(`${outDir}/${group}.json`, await readFile(`${fallbackDir}/${group}.json`));
      continue;
    } catch {}
  }
  failures++;
}
if (failures === GROUPS.length) process.exit(1);
