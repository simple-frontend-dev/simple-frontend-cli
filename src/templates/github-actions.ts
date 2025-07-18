import yaml from "yaml";
import { type AgentName } from "package-manager-detector";
import { getExecCommand } from "../utils/package-manager.js";
import { Solutions } from "../solutions/install-solutions.js";

function getAgentActionSetup(agent: AgentName) {
  switch (agent) {
    case "pnpm":
      return [
        {
          uses: "pnpm/action-setup@v4",
        },
        {
          uses: "actions/setup-node@v4",
          with: {
            "node-version": "lts/*",
            cache: agent,
          },
        },
      ];
    case "bun":
      return [
        {
          uses: "oven-sh/setup-bun@v2",
        },
      ];
    default:
      return [
        {
          uses: "actions/setup-node@v4",
          with: {
            "node-version": "lts/*",
            cache: agent,
          },
        },
      ];
  }
}

function getSetupSteps(agent: AgentName) {
  return [
    {
      uses: "actions/checkout@v4",
    },
    ...getAgentActionSetup(agent),
    {
      name: "Install dependencies",
      run: `${agent} install`,
    },
  ];
}

function getPrettierActionSetup(agent: AgentName) {
  return {
    name: "Run code quality format check",
    run: getExecCommand(agent, "prettier", [
      "--check",
      "--ignore-unknown",
      "src",
    ]),
  };
}

function getEslintActionSetup(agent: AgentName) {
  return {
    name: "Run code quality lint check with eslint",
    run: getExecCommand(agent, "eslint", ["--no-warn-ignored", "src"]),
  };
}

function getOxlintActionSetup(agent: AgentName) {
  return {
    name: "Run code quality lint check with oxlint",
    run: getExecCommand(agent, "oxlint", ["src"]),
  };
}

function getGithubActionsTemplate({
  agent,
  solutions,
}: {
  agent: AgentName;
  solutions: Solutions;
}) {
  return {
    name: "Continuous Integration",
    on: {
      pull_request: {
        branches: ["main"],
      },
    },
    concurrency: {
      group: "${{ github.workflow }}-${{ github.ref }}",
      "cancel-in-progress": true,
    },
    jobs: {
      "quality-checks": {
        "runs-on": "ubuntu-latest",
        steps: [
          ...getSetupSteps(agent),
          ...(solutions.includes("prettier")
            ? [getPrettierActionSetup(agent)]
            : []),
          ...(solutions.includes("eslint")
            ? [getEslintActionSetup(agent)]
            : []),
          ...(solutions.includes("oxlint")
            ? [getOxlintActionSetup(agent)]
            : []),
        ],
      },
    },
  };
}

export function appendToWorkflowFile({
  existingWorkflow,
  solutions,
  agent,
}: {
  existingWorkflow: string;
  solutions: Solutions;
  agent: AgentName;
}) {
  // If the workflow file is empty, return the template directly
  if (!existingWorkflow) {
    return yaml.stringify(getGithubActionsTemplate({ agent, solutions }));
  }

  // extend existing steps with prettier and/or eslint
  const config = yaml.parse(existingWorkflow) ?? {};
  const template = getGithubActionsTemplate({ agent, solutions });

  const existingSteps: Array<{ name: string; run: string }> =
    config.jobs?.["quality-checks"]?.steps ?? [];

  const steps = [
    ...existingSteps,
    ...(solutions.includes("prettier") &&
    !existingSteps.find((step) => step.name === "Run code quality format check")
      ? [getPrettierActionSetup(agent)]
      : []),
    ...(solutions.includes("eslint") &&
    !existingSteps.find((step) => step.name === "Run code quality lint check")
      ? [getEslintActionSetup(agent)]
      : []),
  ];

  return yaml.stringify({
    ...template,
    ...config,
    jobs: {
      ...config.jobs,
      "quality-checks": {
        "runs-on": "ubuntu-latest",
        ...(config.jobs?.["quality-checks"] ?? {}),
        steps,
      },
    },
  });
}
