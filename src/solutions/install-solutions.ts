import { log, isCancel, cancel, confirm } from "@clack/prompts";
import { setupPrePushHook } from "./pre-push-hook.js";
import { setupPrettier } from "./prettier.js";
import { setupEslint } from "./eslint.js";
import { setupEslintConfigPrettier } from "./eslint-config-prettier.js";
import { setupGithubActions } from "./github-actions.js";
export type Solutions = ("prettier" | "eslint")[];

export async function installSolutions({
  solutions,
}: {
  solutions: Solutions;
}) {
  solutions.forEach(async (solution) => {
    if (solution === "prettier") {
      setupPrettier();
    }
    if (solution === "eslint") {
      await setupEslint();
    }
    log.success(`Successfully setup: ${solution}`);
  });

  if (solutions.includes("prettier") && solutions.includes("eslint")) {
    log.info(
      "Installing eslint-config-prettier to turn off ESLint rules that conflict with Prettier",
    );
    setupEslintConfigPrettier();
  }

  const prePushHookConfirm = await confirm({
    message: "Setup formatting pre-push hook? (recommended)",
  });
  if (isCancel(prePushHookConfirm)) {
    cancel("Pre=push hook setup cancelled");
    return;
  }

  if (prePushHookConfirm) {
    log.info("Setting up pre-push hook solution: lefthook");
    setupPrePushHook({ solutions });
    log.success("Setup pre-push hook solution: lefthook");
  }

  const githubActionsConfirm = await confirm({
    message: "Setup GitHub Actions workflow?",
  });
  if (isCancel(githubActionsConfirm)) {
    cancel("GitHub Actions setup cancelled");
    return;
  }

  if (githubActionsConfirm) {
    log.info("Setting up GitHub Actions workflow");
    setupGithubActions({ solutions });
    log.success("Setup GitHub Actions workflow");
  }
}
