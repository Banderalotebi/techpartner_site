const path = require("path");
const fs = require("fs");
const express = require("express");

function log(message, source) {
  source = source || "express";
  var t = new Date().toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true
  });
  console.log(t + " [" + source + "] " + message);
}

function serveStatic(app) {
  var distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error("Could not find the build directory: " + distPath);
  }
  app.use(express.static(distPath));
  app.use("*", function(_req, res) {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

function setupVite(app, server) {
  throw new Error("setupVite should not be called in production");
}

module.exports = { log: log, serveStatic: serveStatic, setupVite: setupVite };
