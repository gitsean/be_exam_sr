import fs from "fs";
import path from "path";
import { promisify } from "util";
import createCsv from "./create.csv";

const cfile = path.join(__dirname, "..", "input", "test2.csv");
const jfile = path.join(__dirname, "..", "output", "test2.json");
const ecfile = path.join(__dirname, "..", "input", "etest.csv");
const ejfile = path.join(__dirname, "..", "output", "etest.json");
const efile = path.join(__dirname, "..", "error", "etest.csv");

const write = promisify(fs.appendFile);
const del = promisify(fs.unlink);

describe("create.csv.js", async () => {
  beforeAll(async () => {
    const files = [cfile, jfile, ecfile, ejfile, efile];
    const dels = [];
    for (let file of files) {
      if (fs.existsSync(file)) {
        dels.push(del(file));
      }
    }
    await Promise.all(files);
    const fileStr = `INTERNAL_ID,FIRST_NAME,MIDDLE_NAME,LAST_NAME,PHONE_NUM
      12345678,Bobby,,Tables,555-555-5555
      12345679,Linda,J,Son,555-555-5556
      12345680,Linda,J,Son,555-555-5557`;

    const badFileStr = `INTERNAL_ID,FIRST_NAME,MIDDLE_NAME,LAST_NAME,PHONE_NUM
      12345678,Bobby,,Tables,555-555-5555,whattheheck?
      12345679,Linda,J,Son,,555-555-5556,woof
      12345680,Linda,J,Son,555-555-5557`;

    try {
      await write(cfile, fileStr, "utf-8");
      await write(ecfile, badFileStr, "utf-8");
    } catch (e) {
      console.log("error: ", e);
    }
  });

  test("should create a csv file", async () => {
    await createCsv("test2");
    expect(fs.existsSync(cfile)).toBe(true);
  });

  test("should log errors", async () => {
    await createCsv("etest");
    expect(fs.existsSync(ejfile)).toBe(true);
    expect(fs.existsSync(efile)).toBe(true);
  });
});
