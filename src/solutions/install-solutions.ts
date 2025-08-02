import { log, isCancel, cancel, confirm } from "@clack/prompts";
import { setupPrePushHook } from "./pre-push-hook.ts";
import { setupPrettier } from "./prettier.ts";
import { setupEslint } from "./eslint.ts";
import { setupOxlint } from "./oxlint.ts";
import { setupEslintConfigPrettier } from "./eslint-config-prettier.ts";
import { setupGithubActions } from "./github-actions.ts";
import { setupTypescript } from "./typescript.ts";

export type Solutions = ("prettier" | "eslint" | "typescript" | "oxlint")[];

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

  if (solutions.includes("oxlint")) {
    await setupOxlint();
  }

  if (solutions.includes("prettier") && solutions.includes("eslint")) {
    log.info(
      "Installing eslint-config-prettier to turn off ESLint rules that conflict with Prettier",
    );
    setupEslintConfigPrettier();
  }

  if (solutions.includes("typescript")) {
    await setupTypescript();
  }

  if (
    !(
      solutions.includes("prettier") ||
      solutions.includes("eslint") ||
      solutions.includes("oxlint")
    )
  ) {
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
    log.success(
      "Sucessfully Setup pre-push hook solution: lefthook and created lefthook.yml",
    );
  }

  const githubActionsConfirm = await confirm({
    message: "Setup GitHub Actions workflow?",
  });
  if (isCancel(githubActionsConfirm)) {
    cancel("GitHub Actions setup cancelled");
  }

  if (githubActionsConfirm) {
    setupGithubActions({ solutions });
    log.success(
      "Successfully setup GitHub Actions workflow and created .github/workflows/quality-checks.yml",
    );
  }
}
