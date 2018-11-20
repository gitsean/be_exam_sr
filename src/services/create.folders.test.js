import fs from "fs";
import path from "path";
import createFolders from "./create.folders";

const dir = name => {
  return path.join(__dirname, "..", name);
};
const testFolderNames = {
  input: "uniqueInput",
  output: "uniqueOutput",
  error: "uniqueError"
};

const inputPath = dir(testFolderNames.input);
const outputPath = dir(testFolderNames.output);
const errorPath = dir(testFolderNames.error);

afterAll(async () => {
  fs.rmdirSync(dir(testFolderNames.input));
  fs.rmdirSync(dir(testFolderNames.output));
  fs.rmdirSync(dir(testFolderNames.error));
  process.env.INPUT = null;
  process.env.OUTPUT = null;
  process.env.ERROR = null;
});

describe("create.folders.js", () => {
  test("should start with no recognized folders", () => {
    expect(fs.existsSync(inputPath)).toBe(false);
    expect(fs.existsSync(outputPath)).toBe(false);
    expect(fs.existsSync(errorPath)).toBe(false);
  });

  test("should create all folders if they do not exists", async () => {
    await createFolders(testFolderNames);

    expect(fs.existsSync(inputPath)).toBe(true);
    expect(fs.existsSync(outputPath)).toBe(true);
    expect(fs.existsSync(errorPath)).toBe(true);
  });

  test("should not create a folder or error if one already exists with the provided name", async () => {
    let error = null;
    try {
      await createFolders(testFolderNames);
    } catch (err) {
      error = err;
    }
    expect(error).toBeNull();
  });

  test("should set env variables to folder names", async () => {
    expect(process.env.INPUT).toBe(testFolderNames.input);
    expect(process.env.OUTPUT).toBe(testFolderNames.output);
    expect(process.env.ERROR).toBe(testFolderNames.error);
  });

  test;
});
