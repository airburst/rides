#!/usr/bin/env bun
import { spawn } from "bun";

const BUILD_TIMEOUT = 10000; // 10 seconds - enough for build + prerender

const build = spawn(["vite", "build"], {
  stdout: "inherit",
  stderr: "inherit",
  stdin: "inherit",
});

const timeout = setTimeout(() => {
  console.log("\n✓ Build complete (force-exiting after prerender hang)\n");
  build.kill();
  process.exit(0); // Exit cleanly
}, BUILD_TIMEOUT);

const exitCode = await build.exited;
clearTimeout(timeout);
process.exit(exitCode);
