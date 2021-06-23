const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const nodeExpress = require("./configs/nodeExpress");
const staticConfig = require("./configs/staticConfig");
const fef = require("./configs/fef");

const existingconfig = fs.existsSync("now.json");

async function buildconfig() {
  let config = {
    version: 2,
  };
  const answers = await inquirer.prompt([
    {
      type: "text",
      name: "name",
      message: "what is the name of project?",
      default: path.basename(process.cwd()),
    },
    {
      type: "list",
      name: "type",
      message: "what type of project?",
      choices: [
        "node-express",
        "static",
        "react",
        "vue",
        "static-build",
        "lambda",
      ],
    },
  ]);
  config.name = answers.name;
  switch (answers.type) {
    case "node-express":
      // eslint-disable-next-line no-undef
      config = await nodeExpress(config);
      break;
    case "staticConfig":
      // eslint-disable-next-line no-undef
      config = await staticConfig(config);
      break;
    case "react":
      config = await fef(config, "build");
      break;
    case "vue":
      config = await fef(config);
      break;
    case "static-build":
      config = await fef(config);
      break;
    default:
      break;
  }
  console.log(config);
}
const questions = [];
if (existingconfig) {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "Overwrite",
        message: "now.json already exists! Would you like to Overwrite?",
        default: false,
      },
    ])
    .then((answers) => {
      if (answers.overwrite) {
        buildconfig();
      } else {
        console.log("GoodBye!");
      }
    });
} else {
  buildconfig();
}
