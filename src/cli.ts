#!/usr/bin/env node

import { program } from "commander";
import { setupCommand } from "./commands/setup.js";

setupCommand({ program });

program.parse();
