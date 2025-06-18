#!/usr/bin/env node

const { execSync } = require("node:child_process");
const path = require("node:path");

console.log("🧪 Running CuuTruyenParser Tests...\n");

try {
  // Run the test file with ts-node
  const testFile = path.join(
    __dirname,
    "..",
    "src",
    "provider",
    "test-parser.ts",
  );

  // Check if ts-node is available
  try {
    execSync("npx ts-node --version", { stdio: "ignore" });
  } catch {
    console.log("📦 Installing ts-node...");
    execSync("npm install -g ts-node", { stdio: "inherit" });
  }

  // Run the test
  execSync(`npx ts-node ${testFile}`, {
    stdio: "inherit",
    cwd: path.join(__dirname, ".."),
  });
} catch (error) {
  console.error("❌ Test execution failed:", error.message);
  process.exit(1);
}
