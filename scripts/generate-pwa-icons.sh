#!/bin/bash

# This script generates PWA icons from a source image.
# Usage: ./generate-pwa-icons.sh <source_image> <output_dir>

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick is required but not installed. Please install it first."
    exit 1
fi

SOURCE=$1
OUTPUT_DIR=$2

if [ -z "$SOURCE" ] || [ -z "$OUTPUT_DIR" ]; then
    echo "Usage: ./generate-pwa-icons.sh <source_image> <output_dir>"
    exit 1
fi

if [ ! -f "$SOURCE" ]; then
    echo "Error: Source image $SOURCE does not exist"
    exit 1
fi

if [ ! -d "$OUTPUT_DIR" ]; then
    mkdir -p "$OUTPUT_DIR"
fi

# Generate favicon.svg (if source is SVG)
if [[ "$SOURCE" == *.svg ]]; then
    cp "$SOURCE" "$OUTPUT_DIR/favicon.svg"
else
    echo "Note: Source is not SVG, skipping favicon.svg generation"
fi

# Generate PWA icons
convert "$SOURCE" -resize 192x192 "$OUTPUT_DIR/pwa-192x192.png"
convert "$SOURCE" -resize 512x512 "$OUTPUT_DIR/pwa-512x512.png"

# Generate Apple touch icon
convert "$SOURCE" -resize 180x180 "$OUTPUT_DIR/apple-touch-icon.png"

# Generate maskable icon (with margin for safe area)
convert "$SOURCE" -resize 512x512 -gravity center -extent 512x512 "$OUTPUT_DIR/mask-icon.svg"

echo "PWA icons generated successfully in $OUTPUT_DIR"
