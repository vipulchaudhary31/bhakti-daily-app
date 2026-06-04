import { existsSync } from "node:fs";
import { networkInterfaces } from "node:os";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const port = process.env.PORT || "5173";
const viteBin = fileURLToPath(new URL("../node_modules/vite/bin/vite.js", import.meta.url));

function getLocalIpv4Addresses() {
  return Object.values(networkInterfaces())
    .flat()
    .filter((entry) => entry?.family === "IPv4" && !entry.internal)
    .map((entry) => entry.address);
}

const addresses = getLocalIpv4Addresses();

console.log("\nAndroid phone testing");
console.log("1. Keep your Android phone on the same Wi-Fi as this computer.");
console.log("2. Open one of these URLs in Chrome on the phone:\n");

if (addresses.length === 0) {
  console.log(`   http://<this-computer-ip>:${port}/`);
  console.log("\nNo LAN IPv4 address was detected. Check Wi-Fi/network settings.");
} else {
  addresses.forEach((address) => {
    console.log(`   http://${address}:${port}/`);
  });
}

console.log("\nVite will hot-reload the phone when files change.\n");

if (!existsSync(viteBin)) {
  console.error("Vite is not installed yet. Run npm install, then npm run dev:phone.");
  process.exit(1);
}

const child = spawn(process.execPath, [viteBin, "--host", "0.0.0.0", "--port", port], {
  stdio: "inherit",
});

function stop() {
  child.kill("SIGTERM");
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);
child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
