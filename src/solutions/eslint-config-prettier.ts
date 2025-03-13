import { packageManager, installPackage } from "../utils/package-manager.js";
import { log } from "@clack/prompts";
import color from "picocolors";

const PACKAGE = "eslint-config-prettier";

export function setupEslintConfigPrettier() {
  try {
    // step 1: install package (conveniently updates if needed)
    installPackage({
      packageName: PACKAGE,
      agent: packageManager.name,
    });

    log.warn(
      `You need to update your eslint config file (likely eslint.config.js) to use eslint-config-prettier:

${color.green(`import eslintConfigPrettier from "eslint-config-prettier/flat"`)}

export default [
    ...
    ${color.green("eslintConfigPrettier")}
]`,
    );
  } catch (error: unknown) {
    log.error(
      `Failed to install formatting solution: ${PACKAGE} - error: ${error}`,
    );
  }
}
