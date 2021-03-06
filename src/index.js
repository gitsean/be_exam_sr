import watcher from "./services/detect.input";
import path from "path";
import prompt from "prompt-async";
import createFolders from "./services/create.folders";
const file = path.join(__dirname, "..", "input", "/test.txt");

async function userPrompt() {
  prompt.start();
  try {
    const { input, output, error } = await prompt.get([
      {
        name: "input",
        description: "Input Folder Name (input)",
        required: false
      },
      {
        name: "output",
        description: "Output Folder Name (output)",
        required: false
      },
      {
        name: "error",
        description: "Error Folder Name (error)",
        required: false
      }
    ]);

    const answers = {
      input,
      output,
      error
    };

    return answers;
  } catch (err) {
    throw new Error("Error on user prompt: ", err);
  }
}

async function run() {
  const folderNames = await userPrompt();
  createFolders(folderNames);
  console.log("process.env.INPUT from index - ", process.env.INPUT);
  watcher();
}

run();
