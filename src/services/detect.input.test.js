import fs from "fs";
import path from "path";
import { promisify } from "util";
import watcher from "./detect.input";

const file = path.join(__dirname, "..", "input", "/test.txt");
const write = promisify(fs.appendFile);
const del = promisify(fs.unlink);
function delay(t, val) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(val);
    }, t);
  });
}

describe("detect.input.js", () => {
  beforeAll(async () => {
    watcher();
    process.env.DETECTED = "false";
    try {
      await write(file, "Not much here. Terribly sorry.", "utf-8");
    } catch (e) {
      console.log("error: ", e);
    }
  });

  afterAll(async () => {
    process.env.DETECTED = "false";
    try {
      await del(file);
    } catch (e) {
      console.log("error: ", e);
    }
  });

  test("should detect change when file is created", async () => {
    await delay(500);
    expect(process.env.DETECTED).toBe("true");
  });
});
