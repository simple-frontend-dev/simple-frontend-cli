import { log, isCancel, cancel, confirm } from "@clack/prompts";
import { setupPrePushHook } from "./pre-push-hook.js";
import { setupPrettier } from "./prettier.js";
import { setupEslint } from "./eslint.js";
import { setupEslintConfigPrettier } from "./eslint-config-prettier.js";
import { setupGithubActions } from "./github-actions.js";
import { setupTypescript } from "./typescript.js";
import { getExecCommand } from "../utils/package-manager.js";
import { packageManager } from "../utils/package-manager.js";
import { execSync } from "child_process";

export type Solutions = ("prettier" | "eslint" | "typescript")[];

export async function installSolutions({
  solutions,
}: {
  solutions: Solutions;
}) {
  if (solutions.includes("prettier")) {
    setupPrettier();
  }

  if (solutions.includes("eslint")) {
    await setupEslint();
  }

  if (solutions.includes("prettier") && solutions.includes("eslint")) {
    log.info(
      "Installing eslint-config-prettier to turn off ESLint rules that conflict with Prettier",
    );
    setupEslintConfigPrettier();
  }

  if (solutions.includes("typescript")) {
    await setupTypescript();

    if (solutions.includes("prettier")) {
      execSync(
        `${getExecCommand(packageManager.name)} prettier --write tsconfig.json`,
      );
    }
  }

  if (!(solutions.includes("prettier") || solutions.includes("eslint"))) {
    // no need to ask for pre-push hook or github actions if no formatting or linting is setup
    return;
  }

  const prePushHookConfirm = await confirm({
    message: "Setup pre-push hook? (recommended)",
  });
  if (isCancel(prePushHookConfirm)) {
    cancel("Pre=push hook setup cancelled");
  }

  if (prePushHookConfirm) {
    setupPrePushHook({ solutions });
    log.success("Sucessfully Setup pre-push hook solution: lefthook");
  }

  const githubActionsConfirm = await confirm({
    message: "Setup GitHub Actions workflow?",
  });
  if (isCancel(githubActionsConfirm)) {
    cancel("GitHub Actions setup cancelled");
  }

  if (githubActionsConfirm) {
    setupGithubActions({ solutions });
    log.success("Successfully setup GitHub Actions workflow");
  }
}
