#!/bin/bash

# Initialize counter
total=0

# List of file extensions to count
# extensions=("*.js" "*.cjs" "*.mjs" "*.ts" "*.tsx" "*.html" "*.css")
extensions=("*.ts" "*.tsx" "*.html" "*.css")

# Loop over each file extension
for ext in "${extensions[@]}"
do
  total=$((total + $(find . -name "*.tsx" -type f -exec wc -l {} \; | awk '{total += $1} END {print total}')))
done

# Print the total number of lines
echo "Total lines of code: $total"
