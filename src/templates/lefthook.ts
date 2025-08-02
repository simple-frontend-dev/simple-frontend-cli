import { type AgentName } from "package-manager-detector";
import yaml from "yaml";
import { getExecCommand } from "../utils/package-manager.ts";
import { type Solutions } from "../solutions/install-solutions.ts";

function prettierPrePushHook(agent: AgentName) {
  return {
    format: {
      tags: "code-quality",
      // files: "git diff-tree --no-commit-id --name-only -r HEAD..origin/main",
      // run: getExecCommand(agent, "prettier", ["--check", "--ignore-unknown", "{files}"]),
      run: getExecCommand(agent, "prettier", [
        "--check",
        "--ignore-unknown",
        "src",
      ]),
    },
  };
}

function eslintPrePushHook(agent: AgentName) {
  return {
    lint: {
      tags: "code-quality",
      // files: "git diff-tree --no-commit-id --name-only -r HEAD..origin/main",
      // run: getExecCommand(agent, "eslint", ["--no-warn-ignored", "{files}"]),
      run: getExecCommand(agent, "eslint", ["--no-warn-ignored", "src"]),
    },
  };
}

function oxlintPrePushHook(agent: AgentName) {
  return {
    lint: {
      tags: "code-quality",
      run: getExecCommand(agent, "oxlint", ["src"]),
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
          } else if (solution === "oxlint") {
            acc = { ...acc, ...oxlintPrePushHook(agent) };
          }
          return acc;
        }, {}),
        ...config["pre-push"]?.commands,
      },
    },
  });
}
