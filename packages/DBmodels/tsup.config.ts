import { defineConfig } from "tsup";

export default defineConfig({
    // clean: true,
    dts: true, //for types? Must be specified in package.json
    entry: ["src/index.ts"],
    format: ["cjs", "esm"], //The JS and tje JS for exporting modules? Must be specified in package.json
    minify: false,
    sourcemap: true //whats the source map?
})