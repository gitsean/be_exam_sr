import fs from "fs";
import path from "path";
import createCsv from "./create.csv";

const watcher = () => {
  const folder = process.env.INPUT || "input";
  const dir = path.join(__dirname, "..", folder);

  console.log(`Watching for files in folder ${folder}`);
  console.log("Ctrl + C to exit");

  var lock = false;

  return fs.watch(dir, (eventType, filename) => {
    process.env.DETECTED = "true";

    const extArray = filename.split(".");

    const extension = extArray[extArray.length - 1].toLocaleLowerCase().trim();
    if (eventType === "change" && extension === "csv" && !lock) {
      lock = true;
      extArray.pop();
      const name = extArray.join("");
      createCsv(name);
      setTimeout(() => (lock = false), 1000);
    }

    if (filename) {
      console.log(`filename provided: ${filename}`);
    } else {
      console.log("filename not provided");
    }
  });
};

module.exports = watcher;
