#!/bin/bash
cp -r build/* .
rm -r components
rm -r node_modules
rm -r scripts
rm -r styles
rm -r views
rm .gitignore
rm .jshintrc
rm config.json
rm gulpfile.js
rm release.sh