import { type AgentName } from "package-manager-detector";
import yaml from "yaml";
import { getExecCommand } from "../utils/package-manager.js";
import { type Solutions } from "../solutions/install-solutions.js";

function prettierPrePushHook(agent: AgentName) {
  return {
    format: {
      tags: "code-quality",
      // files: "git diff-tree --no-commit-id --name-only -r HEAD..origin/main",
      // run: `${getExecCommand(agent)} prettier --check --ignore-unknown {files}`,
      run: `${getExecCommand(agent)} prettier --check --ignore-unknown .`,
    },
  };
}

function eslintPrePushHook(agent: AgentName) {
  return {
    lint: {
      tags: "code-quality",
      // files: "git diff-tree --no-commit-id --name-only -r HEAD..origin/main",
      // run: `${getExecCommand(agent)} eslint --no-warn-ignored {files}`,
      run: `${getExecCommand(agent)} eslint --no-warn-ignored .`,
    },
  };
}

export function appendToLefthookFile({
  existingConfig,
  solutions,
  agent,
}: {
  existingConfig: string;
  solutions: Solutions;
  agent: AgentName;
}) {
  const config = yaml.parse(existingConfig) ?? {};

  return yaml.stringify({
    ...config,
    "pre-push": {
      parallel: true,
      ...config["pre-push"],
      commands: {
        ...solutions.reduce((acc, solution) => {
          if (solution === "prettier") {
            acc = { ...acc, ...prettierPrePushHook(agent) };
          } else if (solution === "eslint") {
            acc = { ...acc, ...eslintPrePushHook(agent) };
          }
          return acc;
        }, {}),
        ...(config["pre-push"]?.commands ?? {}),
      },
    },
  });
}
