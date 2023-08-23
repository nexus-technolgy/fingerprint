const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    minify: true,
    sourcemap: false,
    outfile: "dist/fingerprint.min.js",
    loader: { ".ts": "ts" },
    format: "esm",
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
