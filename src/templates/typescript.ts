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
  include: ["./src"],
};

export const typeScriptConfigurationScript = {
  extends: [
    "@tsconfig/node-lts/tsconfig.json",
    "@tsconfig/strictest/tsconfig.json",
  ],
  compilerOptions: {
    moduleResolution: "NodeNext",
    module: "NodeNext",
    sourceMap: true,
    noEmit: true,
    allowImportingTsExtensions: true,
  },
  include: ["./src"],
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
  include: ["./src"],
};
