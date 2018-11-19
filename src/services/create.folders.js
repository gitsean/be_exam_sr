import fs from "fs";
import path from "path";
import { promisify } from "util";
import watcher from "./detect.input";

const file = path.join(__dirname, "..", "input", "/test.txt");
const exists = promisify(fs.exists);
const del = promisify(fs.unlink);

describe("create.folders.js", () => {
  beforeAll(async () => {});

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
