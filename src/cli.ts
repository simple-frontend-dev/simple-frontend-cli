#!/usr/bin/env node

import { program } from "commander";
import { setupCommand } from "./commands/setup.ts";

setupCommand({ program });

program.parse();
