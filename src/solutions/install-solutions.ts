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
  await Promise.all(
    solutions.map(async (solution) => {
      if (solution === "prettier") {
        setupPrettier();
      } else if (solution === "eslint") {
        await setupEslint();
      }
      log.success(`Successfully setup: ${solution}`);
    }),
  );

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
    setupPrePushHook({ solutions });
    log.success("Sucessfully Setup pre-push hook solution: lefthook");
  }

  const githubActionsConfirm = await confirm({
    message: "Setup GitHub Actions workflow?",
  });
  if (isCancel(githubActionsConfirm)) {
    cancel("GitHub Actions setup cancelled");
    return;
  }

  if (githubActionsConfirm) {
    setupGithubActions({ solutions });
    log.success("Successfully setup GitHub Actions workflow");
  }
}
