import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  packageManager,
  installPackage,
  getLockFileIgnorePattern,
} from "../utils/package-manager.js";
import { log } from "@clack/prompts";

const PACKAGE = "prettier";

export function setupPrettier() {
  try {
    // step 1: install package (conveniently updates if needed)
    installPackage({
      packageName: PACKAGE,
      agent: packageManager.name,
    });

    // step 2: if .prettierrc does not exist, create an empty one
    if (!existsSync(resolve("./.prettierrc"))) {
      writeFileSync(resolve("./.prettierrc"), "{}\n");
    }

    // step 3: if .prettierignore does not exist, create an empty one
    if (!existsSync(resolve("./.prettierignore"))) {
      writeFileSync(
        resolve("./.prettierignore"),
        `${getLockFileIgnorePattern(packageManager.name)}\n`,
      );
    }
  } catch (error: unknown) {
    log.error(
      `Failed to install formatting solution: ${PACKAGE} - error: ${error}`,
    );
  }
}
