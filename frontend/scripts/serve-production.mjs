/**
 * Sirve dist/ en 0.0.0.0:PORT para PaaS (Railway). Escuchar solo en localhost provoca 502.
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = String(process.env.PORT || "3000");

const child = spawn(
  "npx",
  ["--no-install", "serve", "-s", "dist", "-l", `tcp://0.0.0.0:${port}`],
  { cwd: root, stdio: "inherit", shell: true, env: process.env }
);

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
