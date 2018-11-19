import watcher from "./services/detect.input";
import path from "path";
import prompt from "prompt-async";
const file = path.join(__dirname, "..", "input", "/test.txt");

async function userPrompt() {
  prompt.start();
  try {
    const { input, output, error } = await prompt.get([
      { name: "input", description: "Input Folder Name", required: true },
      { name: "output", description: "Output Folder Name", required: true },
      { name: "error", description: "Error Folder Name", required: true }
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

async function askUser() {
  const folderNames = await userPrompt();
  watcher();
}

askUser();