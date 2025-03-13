import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { packageManager, installPackage } from "../utils/package-manager.js";
import { log } from "@clack/prompts";
import { appendToLefthookFile } from "../templates/lefthook.js";
import { type Solutions } from "./install-solutions.js";

const PACKAGE = "lefthook";

export function setupPrePushHook({ solutions }: { solutions: Solutions }) {
  try {
    // step 1: install package (conveniently updates if needed)
    installPackage({
      packageName: PACKAGE,
      agent: packageManager.name,
    });

    log.info(`Setting up pre-push hook for solutions: ${solutions.join(", ")}`);

    // step 2: if lefthook.yml already exists, read it to not override the existing configuration
    let existingLefthookConfig = "";
    if (existsSync(resolve("./lefthook.yml"))) {
      log.info("lefthook.yml already exists, appending configuration");
      existingLefthookConfig = readFileSync(resolve("./lefthook.yml"), "utf-8");
    }
    // step 3: append the configuration required for the solution
    const finalLefthookConfig = appendToLefthookFile({
      existingConfig: existingLefthookConfig,
      solutions,
      agent: packageManager.name,
    });

    // step 4: replace the pre-push hook with the new one
    writeFileSync(resolve("./lefthook.yml"), finalLefthookConfig, "utf-8");
  } catch (error: unknown) {
    log.warn(
      `Failed to install pre-push hook solution: ${PACKAGE} - error: ${error}`,
    );
  }
}
