import fs from "fs";
import path from "path";
import { promisify } from "util";

const dir = path.join(__dirname, "..", "input");
const watch = promisify(fs.watch);

// const res = watch(dir);
const watcher = fs.watch(dir, (eventType, filename) => {
  console.log("SETTING.");

  process.env.DETECTED = "true";

  console.log(`event type is: ${eventType}`);
  if (filename) {
    console.log(`filename provided: ${filename}`);
  } else {
    console.log("filename not provided");
  }
});

module.exports = watcher;
