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

describe("create.csv.js", () => {
  beforeAll(async () => {
    const fileStr = `INTERNAL_ID,FIRST_NAME,MIDDLE_NAME,LAST_NAME,PHONE_NUM
      12345678,Bobby,,Tables,555-555-5555
      12345679,Linda,J,Son,555-555-5556
      12345680,Linda,J,Son,555-555-5557`;

    const badFileStr = `INTERNAL_ID,FIRST_NAME,MIDDLE_NAME,LAST_NAME,PHONE_NUM
      12345678,Bobby,,Tables,555-555-5555,whattheheck
      12345679,Linda,J,Son,,555-555-5556,woof
      12345680,Linda,J,Son,555-555-5557`;

    try {
      await write(cfile, fileStr, "utf-8");
      await write(ecfile, badFileStr, "utf-8");
    } catch (e) {
      console.log("error: ", e);
    }
  });

  afterAll(async () => {
    try {
      await del(cfile);
      await del(jfile);
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

// error records should be written to a csv file in error-directory

// if errors exist, one error file is created per input file.

// processing should continue in the event of an invalid row; all errors should be collected and added to the corresponding error csv.

// an error record should contain:
//     LINE_NUM : the number of the record which was invalid
//     ERROR_MSG : a human readable error message about what validation failed
// in the event of name collision, the latest file should overwrite the earlier version.
// the error file should match the name of the input file.
