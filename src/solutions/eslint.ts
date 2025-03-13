import { log } from "@clack/prompts";
import { spawnSync } from "node:child_process";

export async function setupEslint() {
  log.info(
    "For eslint installation and setup, we are piping you to the ESLint CLI",
  );

  try {
    spawnSync("pnpm", ["create", "@eslint/config@latest"], {
      stdio: "inherit",
    });
  } catch (error) {
    log.error(error as string);
  }
}
