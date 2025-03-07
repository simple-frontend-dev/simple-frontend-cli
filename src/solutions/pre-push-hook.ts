import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { packageManager, installPackage } from "../utils/package-manager.ts";
import { log } from "@clack/prompts";

const PACKAGE = "lefthook";

export function setupPrePushHook({
  solution,
}: {
  solution: "prettier" | "eslint";
}) {
  try {
    // step 1: install package (conveniently add also updates if needed)
    installPackage({
      packageName: PACKAGE,
      agent: packageManager.agent,
    });

    // step 2: if lefthook.yml does not exist, copy the template
    if (!existsSync(resolve("./lefthook.yml"))) {
      copyFileSync(
        resolve(
          import.meta.dirname,
          "..",
          "templates",
          "lefthook-first-install.yml",
        ),
        resolve("./lefthook.yml"),
      );
    }

    // step 3: read the lefthook.yml file and append the configuration required for the solution
    const lefthookConfigContent = readFileSync(
      resolve("./lefthook.yml"),
      "utf-8",
    );

    const lefthooksolutionContent = readFileSync(
      resolve(
        import.meta.dirname,
        "..",
        "templates",
        `lefthook-${solution}.yml`,
      ),
      "utf-8",
    );

    // step 4: replace the pre-push hook with the new one
    writeFileSync(
      resolve("./lefthook.yml"),
      lefthookConfigContent + "\n" + lefthooksolutionContent,
      "utf-8",
    );
  } catch (error: unknown) {
    log.warn(
      `Failed to install pre-push hook solution: ${PACKAGE} - error: ${error}`,
    );
  }
}
