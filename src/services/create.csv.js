import fs from "fs";
import path from "path";
import csv from "csvtojson";
import { promisify } from "util";
const write = promisify(fs.writeFile);

const createCsv = async fileName => {
  const inFolder = process.env.INPUT || "input";
  const dir = path.join(__dirname, "..", inFolder, fileName);

  const jsonArray = await csv().fromFile(dir);

  console.log("jsonArray --- ", jsonArray);

  const outFolder = process.env.OUTPUT || "output";
  const outDir = path.join(__dirname, "..", outFolder, `${fileName}.json`);
  await write(outDir, JSON.stringify(jsonArray, null, 2), "utf8");
};

module.exports = createCsv;
