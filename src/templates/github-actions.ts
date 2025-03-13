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
export function getGithubActionsTemplate({
  agent,
  solutions,
}: {
  agent: AgentName;
  solutions: Solutions;
}) {
  return yaml.stringify({
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
          {
            uses: "actions/checkout@v4",
          },
          ...getAgentActionSetup(agent),
          {
            name: "Install dependencies",
            run: `${agent} install`,
          },
          ...(solutions.includes("prettier")
            ? [
                {
                  name: "Run code quality format check",
                  run: `${getExecCommand(agent)} prettier --check --ignore-unknown src`,
                },
              ]
            : []),
          ...(solutions.includes("eslint")
            ? [
                {
                  name: "Run code quality lint check",
                  run: `${getExecCommand(agent)} eslint --no-warn-ignored src`,
                },
              ]
            : []),
        ],
      },
    },
  });
}
