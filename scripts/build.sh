#!/bin/sh

echo 'Building bundle'

react-scripts build && cp -Rf build/* resources
NODE_ENV=production skpm-build

# Copy resources to sketch plugin
mkdir -p color-copy-paste.sketchplugin/Contents/Resources/_webpack_resources
mkdir -p color-copy-paste.sketchplugin/Contents/Resources/_webpack_resources/static
cp -Rf resources/static* color-copy-paste.sketchplugin/Contents/Resources/_webpack_resources

# Rename sketch plugin name
mkdir -p dist
cp -rf color-copy-paste.sketchplugin dist/color-copy-paste-$(date +%y-%m-%d-%H-%M-%S).sketchplugin