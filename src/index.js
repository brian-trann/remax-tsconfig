#!/usr/bin/env node
const inquirer = require("inquirer");
const path = require("path");
const { writeFile, readdir, readFile } = require("fs").promises;

const tsconfigFolderPath = path.resolve(__dirname, "tsconfig");
const prettierFolderPath = path.resolve(__dirname, "prettier");

(async () => {
  const tsconfigFiles = await readdir(tsconfigFolderPath).catch(console.log);
  const tsconfigTypes = {};

  for (let file of tsconfigFiles) {
    const nodeType = file.split(".")[1];
    tsconfigTypes[nodeType] = path.join(tsconfigFolderPath, file);
  }

  const { nodeType, makePrettierIgnore, makePrettierRc } = await inquirer.prompt([
    {
      type: "list",
      message: "Pick the Node type:",
      name: "nodeType",
      choices: ["node-default", "node-recommended", "node-14", "node-16"],
    },
    {
      type: "confirm",
      message: "Do you want a .prettierignore?",
      name: "makePrettierIgnore",
      default: true,
    },
    {
      type: "confirm",
      message: "Do you want a prettierrc.json?",
      name: "makePrettierRc",
      default: true,
    },
  ]);
  

  const tsconfigData = await readFile(tsconfigTypes[nodeType]).catch(console.log);
  const tsconfigPath = path.join(process.cwd(), "tsconfig.json");

  await writeFile(tsconfigPath, tsconfigData.toString()).catch((e) => {
    console.log(e);
    process.exit(1);
  });
  console.log("\ntsconfig.json created");

  if (makePrettierIgnore) {
    const prettierIgnoreData = await readFile(path.join(prettierFolderPath, "prettierignore")).catch(console.log);
    const prettierIgnorePath = path.join(process.cwd(), ".prettierignore");

    await writeFile(prettierIgnorePath, prettierIgnoreData).catch((e) => {
      console.log(e);
      process.exit(1);
    });
    console.log(".prettierignore created");
  }

  if (makePrettierRc) {
    const prettierRcData = await readFile(path.join(prettierFolderPath, "prettierrc.json")).catch(console.log);
    const prettierRcPath = path.join(process.cwd(), ".prettierrc.json");

    await writeFile(prettierRcPath, prettierRcData).catch((e) => {
      console.log(e);
      process.exit(1);
    });
    console.log("prettier.json created");
  }
  console.log("\n");
})();
