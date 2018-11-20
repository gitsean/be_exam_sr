import fs from "fs";
import path from "path";
import createCsv from "./create.csv";

const watcher = () => {
  const folder = process.env.INPUT || "input";
  const dir = path.join(__dirname, "..", folder);

  console.log(`Watching for files in folder ${folder}`);
  console.log("Ctrl + C to exit");

  return fs.watch(dir, (eventType, filename) => {
    console.log("eventType - ", eventType);
    process.env.DETECTED = "true";

    const extArray = filename.split(".");
    const extenstion = extArray[extArray.length - 1].toLocaleLowerCase().trim();
    if (eventType === "change" && extenstion === "csv") {
      createCsv(filename);
    }

    if (filename) {
      console.log(`filename provided: ${filename}`);
    } else {
      console.log("filename not provided");
    }
  });
};

module.exports = watcher;
