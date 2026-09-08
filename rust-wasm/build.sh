#!/bin/bash

cargo build --target wasm32-unknown-unknown --release
mkdir -p ./pkg
rm -r ./pkg/*
for FILE in target/wasm32-unknown-unknown/*/*.wasm; do cp "$FILE" ./pkg/; done
