import * as esbuild from "esbuild";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("Building frontend with Vite...");
execSync("npx vite build", { stdio: "inherit" });

const indexHtmlPath = path.resolve("dist/public/client/index.html");
const targetPath = path.resolve("dist/public/index.html");
if (fs.existsSync(indexHtmlPath)) {
  fs.copyFileSync(indexHtmlPath, targetPath);
}

fs.mkdirSync("public", { recursive: true });
for (const f of ["sitemap.xml", "sitemap.html", "robots.txt"]) {
  const src = path.resolve("public", f);
  const dest = path.resolve("dist/public", f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  } else {
    fs.writeFileSync(dest, "");
  }
}

console.log("Bundling server with esbuild...");

const viteExcludePlugin = {
  name: "exclude-vite",
  setup(build) {
    // Replace ./vite with a production stub (avoids runtime require('./vite') failure)
    build.onResolve({ filter: /^\.\/vite$/ }, (args) => {
      if (args.importer && args.importer.includes("server")) {
        return { path: "vite-production-stub", namespace: "vite-stub" };
      }
    });

    build.onLoad({ filter: /.*/, namespace: "vite-stub" }, () => {
      return {
        contents: `
          const path = require('path');
          const fs = require('fs');
          const express = require('express');

          function log(message, source) {
            source = source || "express";
            const formattedTime = new Date().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            });
            console.log(formattedTime + " [" + source + "] " + message);
          }

          function serveStatic(app) {
            const distPath = path.resolve(__dirname, "public");
            if (!fs.existsSync(distPath)) {
              throw new Error("Could not find the build directory: " + distPath + ", make sure to build the client first");
            }
            app.use(express.static(distPath));
            app.use("*", function(_req, res) {
              res.sendFile(path.resolve(distPath, "index.html"));
            });
          }

          async function setupVite(app, server) {
            throw new Error("setupVite should not be called in production");
          }

          module.exports = { log, serveStatic, setupVite };
        `,
        loader: "js",
      };
    });

    build.onResolve({ filter: /^vite$|@vitejs|@replit\/vite-plugin|vite-plugin/ }, () => {
      return { path: "vite", external: true };
    });

    build.onResolve({ filter: /\.\.\/vite\.config/ }, () => {
      return { path: "../vite.config", external: true };
    });
  },
};

await esbuild.build({
  entryPoints: ["server/index.ts"],
  outfile: "dist/index.cjs",
  platform: "node",
  format: "cjs",
  bundle: true,
  minify: false,
  sourcemap: true,
  packages: "external",
  plugins: [viteExcludePlugin],
  define: {
    "process.env.NODE_ENV": '"production"',
    "import.meta.dirname": "__dirname",
    "import.meta.url": "__filename",
  },
  treeShaking: true,
});

console.log("Build complete!");
