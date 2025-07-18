import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import open from "open";
import { cancel, confirm, isCancel, log, select } from "@clack/prompts";
import { packageManager, installPackage } from "../utils/package-manager.js";
import {
  typeScriptConfigurationLibrary,
  typeScriptConfigurationScript,
  typeScriptConfigurationServer,
} from "../templates/typescript.js";
const PACKAGE = "typescript";

export async function setupTypescript() {
  try {
    log.info("Now setting up TypeScript");
    // step 1: install package (conveniently updates if needed)
    installPackage({
      packageName: PACKAGE,
      agent: packageManager,
    });

    // step 2: if .tsconfig.json does not exist, start the wizard
    if (existsSync(resolve("./tsconfig.json"))) {
      log.warn("You already have a tsconfig.json file, skipping setup");
      return;
    }

    // step 3: select the environment your project will run in
    const environment = await select({
      message: "Select the environment your project will run in:",
      options: [
        { label: "Node", value: "node" },
        { label: "Browser", value: "browser" },
      ],
    });

    if (isCancel(environment)) {
      cancel("TypeScript setup cancelled");
      return;
    }

    if (environment === "browser") {
      const openViteStarter = await confirm({
        message:
          "For browser environments, I recommend you follow the recommended configurations from Vite starters at https://vite.dev/guide/#trying-vite-online. Do you want to open it now?",
      });
      if (isCancel(openViteStarter)) {
        cancel("TypeScript setup cancelled");
        return;
      } else if (openViteStarter) {
        await open("https://vite.dev/guide/#trying-vite-online");
        log.info(
          "To finish your TypeScript setup, I recommend you follow the recommended configurations from Vite starters at https://vite.dev/guide/#trying-vite-online ",
        );
      }
    } else if (environment === "node") {
      // step 4: select the build context
      const buildContext = await select({
        message: "What are you building?",
        options: [
          { label: "Script utilities", value: "script" },
          { label: "A server application", value: "server" },
          { label: "A library that will be published", value: "library" },
        ],
      });

      if (isCancel(buildContext)) {
        cancel("TypeScript setup cancelled");
        return;
      }

      installPackage({
        packageName: "@types/node",
        agent: packageManager,
      });
      installPackage({
        packageName: "@tsconfig/node-lts",
        agent: packageManager,
      });
      installPackage({
        packageName: "@tsconfig/strictest",
        agent: packageManager,
      });

      if (buildContext === "library") {
        log.warn('Make sure to have `"type": "module"` in your package.json');
        writeFileSync(
          resolve("./tsconfig.json"),
          JSON.stringify(typeScriptConfigurationLibrary, null, 2),
        );
      } else if (buildContext === "script") {
        log.warn('Make sure to have `"type": "module"` in your package.json');
        writeFileSync(
          resolve("./tsconfig.json"),
          JSON.stringify(typeScriptConfigurationScript, null, 2),
        );
      } else if (buildContext === "server") {
        writeFileSync(
          resolve("./tsconfig.json"),
          JSON.stringify(typeScriptConfigurationServer, null, 2),
        );
      }
      log.success("Successfully setup TypeScript and created tsconfig.json");
    }
  } catch (error: unknown) {
    log.error(`Failed to install typescript - error: ${error}`);
  }
}
