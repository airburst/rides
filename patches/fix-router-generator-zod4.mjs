/**
 * Patch TanStack packages to work with zod v4.
 * Rewrites `from "zod"` to `from "zod/v3"` (zod v4's v3 compat layer)
 * and `require("zod")` to `require("zod/v3")` in TanStack build-time files.
 * Remove this patch when TanStack ships zod v4 support.
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const packages = [
  "node_modules/@tanstack/router-generator/dist",
  "node_modules/@tanstack/router-plugin/dist",
  "node_modules/@tanstack/start-plugin-core/dist",
];

function walk(dir, ext, results = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, ext, results);
    else if (entry.endsWith(ext)) results.push(full);
  }
  return results;
}

let count = 0;
for (const pkg of packages) {
  if (!existsSync(pkg)) continue;
  const files = [...walk(pkg, ".js"), ...walk(pkg, ".cjs")];
  for (const file of files) {
    const original = readFileSync(file, "utf-8");
    const patched = original
      .replace(/from ["']zod["']/g, 'from "zod/v3"')
      .replace(/require\(["']zod["']\)/g, 'require("zod/v3")')
      .replace(/\.prefault\(/g, ".default(");
    if (patched !== original) {
      writeFileSync(file, patched);
      count++;
    }
  }
}
console.log(`Patched ${count} files for zod v3 compat`);
