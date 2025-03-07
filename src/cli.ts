import { program } from "commander";
import { setupCommand } from "./commands/setup.ts";

setupCommand({ program });

program.parse();
