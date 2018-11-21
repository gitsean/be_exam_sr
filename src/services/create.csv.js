import fs from "fs";
import path from "path";
import csv from "csvtojson";
import { promisify } from "util";
const write = promisify(fs.writeFile);

const createCsv = async fileName => {
  const inFolder = process.env.INPUT || "input";
  const dir = path.join(__dirname, "..", inFolder, `${fileName}.csv`);

  const jsonArray = await csv()
    .preRawData(csvRawData => {
      let newData = csvRawData
        .replace("INTERNAL_ID", "id")
        .replace("FIRST_NAME", "name.first")
        .replace("MIDDLE_NAME", "name.middle")
        .replace("LAST_NAME", "name.last")
        .replace("PHONE_NUM", "phone");

      return newData;
    })
    .preFileLine((fileLineString, lineIdx) => {
      console.log("fileLineString: ", fileLineString);
      // if (lineIdx === 2){
      //     return fileLineString.replace('some value','another value')
      // }
      return fileLineString;
    })
    .fromFile(dir);

  console.log("jsonArray --- ", jsonArray);

  const outFolder = process.env.OUTPUT || "output";
  const outDir = path.join(__dirname, "..", outFolder, `${fileName}.json`);
  await write(outDir, JSON.stringify(jsonArray, null, 2), "utf8");
};

module.exports = createCsv;
