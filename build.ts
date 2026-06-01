#!/usr/bin/env bun
import { spawn } from "bun";
import { existsSync, statSync } from "node:fs";

// `vite build` emits all client/server assets, prerenders the SPA shell, then
// HANGS — the TanStack Start prerender server never closes the event loop, so
// the process never exits on its own. We must force-exit.
//
// The old wrapper killed vite after a fixed 10s and ALWAYS exited 0. That races
// the build against a wall clock: on a slow/cold CI box (Vercel) the timer could
// fire before vite finished emitting `dist/client`, yet exit 0 told Vercel the
// build "succeeded" — shipping stale/partial assets to production. (This is what
// caused prod to serve old code while local was fine.)
//
// Instead: wait for the real completion signal (prerender done + the shell file
// written), THEN force-exit 0. If the build errors or never completes within a
// generous safety window, exit NON-ZERO so the deploy fails loudly rather than
// silently shipping stale assets.

const SHELL_FILE = "dist/client/_shell.html";
const COMPLETE_MARKER = "Prerendered"; // "[prerender] Prerendered N pages:"
const ERROR_MARKERS = [
  "error during build",
  "build failed",
  "Build failed",
  "Could not resolve",
];
const SAFETY_TIMEOUT = 240_000; // hard cap; fail (not pass) if exceeded
const FLUSH_DELAY = 300; // let final file writes flush before we kill

const proc = spawn(["vite", "build"], {
  stdout: "pipe",
  stderr: "pipe",
  stdin: "inherit",
});

let settled = false;
let sawError = false;

const buildComplete = () =>
  existsSync(SHELL_FILE) && statSync(SHELL_FILE).size > 0;

const finish = (code: number) => {
  if (settled) return;
  settled = true;
  clearTimeout(safety);
  try {
    proc.kill();
  } catch {
    // already gone
  }
  process.exit(code);
};

const safety = setTimeout(() => {
  console.error(
    `\n✗ Build did not complete within ${SAFETY_TIMEOUT / 1000}s — failing deploy.\n`,
  );
  finish(1);
}, SAFETY_TIMEOUT);

// Tee a stream to the console while scanning it for completion/error markers.
async function pump(
  stream: ReadableStream<Uint8Array>,
  sink: { write: (chunk: string) => unknown },
) {
  const decoder = new TextDecoder();
  for await (const chunk of stream) {
    const text = decoder.decode(chunk);
    sink.write(text);

    if (ERROR_MARKERS.some((m) => text.includes(m))) {
      sawError = true;
    }

    if (!sawError && text.includes(COMPLETE_MARKER)) {
      // Prerender finished. Confirm the shell is on disk, then force-exit.
      setTimeout(() => {
        if (buildComplete()) {
          console.log(
            "\n✓ Build + prerender complete (force-exiting; prerender server does not close)\n",
          );
          finish(0);
        } else {
          console.error(
            `\n✗ Prerender reported done but ${SHELL_FILE} is missing/empty — failing.\n`,
          );
          finish(1);
        }
      }, FLUSH_DELAY);
    }
  }
}

void pump(proc.stdout, process.stdout);
void pump(proc.stderr, process.stderr);

// If vite exits on its own (e.g. a real build failure), honor its exit code.
const exitCode = await proc.exited;
finish(sawError || exitCode !== 0 ? exitCode || 1 : 0);
