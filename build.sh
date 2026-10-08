#!/bin/sh

npx wxt zip -b chrome
npx wxt zip -b firefox
npx web-ext sign --channel unlisted --source-dir .output/firefox-mv2
cp .output/*.zip web-ext-artifacts