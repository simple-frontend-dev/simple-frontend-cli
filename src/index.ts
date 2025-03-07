import { program } from "commander";
import { installCommand } from "./commands/install.ts";

installCommand({ program });

program.parse();
