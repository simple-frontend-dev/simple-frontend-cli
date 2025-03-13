export const typeScriptConfigurationLibrary = {
  extends: [
    "@tsconfig/node-lts/tsconfig.json",
    "@tsconfig/strictest/tsconfig.json",
  ],
  compilerOptions: {
    moduleResolution: "NodeNext",
    module: "NodeNext",
    sourceMap: true,
    declaration: true,
    outDir: "./dist",
    rootDir: "./src",
  },
};

export const typeScriptConfigurationScript = {
  extends: [
    "@tsconfig/node-lts/tsconfig.json",
    "@tsconfig/strictest/tsconfig.json",
  ],
  compilerOptions: {
    moduleResolution: "NodeNext",
    module: "preserve",
    sourceMap: true,
    noEmit: true,
    allowImportingTsExtensions: true,
  },
};

export const typeScriptConfigurationServer = {
  extends: [
    "@tsconfig/node-lts/tsconfig.json",
    "@tsconfig/strictest/tsconfig.json",
  ],
  compilerOptions: {
    moduleResolution: "NodeNext",
    module: "NodeNext",
    sourceMap: true,
    outDir: "./dist",
    rootDir: "./src",
  },
};
