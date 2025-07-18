import { log, multiselect, isCancel, cancel } from "@clack/prompts";
import { setupPrePushHook } from "./pre-push-hook.js";
import { setupGithubActions } from "./github-actions.js";

export const SOLUTION_PATTERNS = [
  { name: "Code formatting", solution: "prettier" },
  { name: "Code linting with eslint", solution: "eslint" },
  { name: "Code linting with oxlint", solution: "oxlint" },
] as const;

export async function installPattern({
  pattern,
}: {
  pattern: "pre-push" | "github-actions";
}) {
  try {
    const solutions = await multiselect({
      message: "Select patterns to setup (enter to skip):",
      options: SOLUTION_PATTERNS.map((pattern) => ({
        label: pattern.name,
        value: pattern.solution,
      })),
      required: false,
    });

    if (isCancel(solutions)) {
      cancel("No patterns selected");
      return;
    }

    if (pattern === "pre-push") {
      setupPrePushHook({ solutions });
    } else if (pattern === "github-actions") {
      setupGithubActions({ solutions });
    }
  } catch (error) {
    log.error(`Failed to install pattern: ${pattern} - error: ${error}`);
  }
}
