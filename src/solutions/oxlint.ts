import { log } from "@clack/prompts";
import { execSync } from "node:child_process";
import {
  packageManager,
  getExecCommand,
  installPackage,
} from "../utils/package-manager.js";

const PACKAGE = "oxlint";

export async function setupOxlint() {
  // step 1: install package (conveniently updates if needed)
  installPackage({
    packageName: PACKAGE,
    agent: packageManager,
  });

  log.info(`Executing ${PACKAGE} --init to create a default configuration`);

  try {
    const command = getExecCommand(packageManager, PACKAGE, ["--init"]);
    execSync(command, { stdio: "inherit" });

    log.success(`Successfully setup ${PACKAGE}`);
  } catch (error: unknown) {
    log.error(
      `Failed to install linting solution: ${PACKAGE} - error: ${error}`,
    );
  }
}
