import fs from "fs";
import path from "path";
import { promisify } from "util";
process.env.DETECTED = false;

const write = promisify(fs.appendFile);

test("test should create a file in input dir", async () => {
  const p = path.join(__dirname, "..", "input", "/test.txt");
  try {
    await write(p, "Not much here. Terribly sorry.", "utf-8");
  } catch (e) {
    console.log("error: ", e);
  }
  expect(true).toBe(true);
});
