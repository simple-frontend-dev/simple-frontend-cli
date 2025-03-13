import { log } from "@clack/prompts";
import { spawnSync } from "node:child_process";
import { packageManager, getCreateCommand } from "../utils/package-manager.js";

const PACKAGE = "@eslint/config@latest";

export async function setupEslint() {
  log.info("Piping you to the ESLint CLI for its installation and setup");

  try {
    spawnSync(
      packageManager.name,
      [getCreateCommand(packageManager.name), PACKAGE],
      {
        stdio: "inherit",
      },
    );
  } catch (error: unknown) {
    log.error(
      `Failed to install formatting solution: ${PACKAGE} - error: ${error}`,
    );
  }
}
