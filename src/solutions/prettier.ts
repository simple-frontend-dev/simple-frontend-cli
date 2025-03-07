import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { packageManager, installPackage } from "../utils/package-manager.ts";
import { log } from "@clack/prompts";

const PACKAGE = "prettier";

export function setupPrettier() {
  try {
    // step 1: install package (conveniently add also updates if needed)
    installPackage({
      packageName: PACKAGE,
      agent: packageManager.agent,
    });

    // step 2: if .prettierrc does not exist, create an empty one
    if (!existsSync(resolve("./.prettierrc"))) {
      writeFileSync(resolve("./.prettierrc"), "{}\n");
    }
  } catch (error: unknown) {
    log.warn(
      `Failed to install formatting solution: ${PACKAGE} - error: ${error}`
    );
  }
}
