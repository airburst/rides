#!/bin/sh
# Patch @tanstack/router-generator to work with zod v4
# zod v4 removed z.function().returns() — replace with z.function()
# Remove this patch when @tanstack/router-generator supports zod v4

ESM="node_modules/@tanstack/router-generator/dist/esm/config.js"
CJS="node_modules/@tanstack/router-generator/dist/cjs/config.cjs"

if [ -f "$ESM" ]; then
  tmp=$(mktemp) && sed 's/z\.function()\.returns(z\.array(z\.string()))/z.function()/g' "$ESM" > "$tmp" && mv "$tmp" "$ESM"
fi
if [ -f "$CJS" ]; then
  tmp=$(mktemp) && sed 's/zod\.z\.function()\.returns(zod\.z\.array(zod\.z\.string()))/zod.z.function()/g' "$CJS" > "$tmp" && mv "$tmp" "$CJS"
fi
