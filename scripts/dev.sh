#!/bin/sh

# Enabled Sketch Hot Reload setting
defaults write com.bohemiancoding.sketch3 AlwaysReloadScript -bool YES

# Build sketch react plugin
skpm-build 

# Install the plugin then start the skpm watch
open color-copy-paste.sketchplugin

(skpm-build --watch &)

# Start React UI watch
react-scripts start
