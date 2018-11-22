import fs from "fs";
import path from "path";
import csv from "csvtojson";
import { promisify } from "util";
const write = promisify(fs.writeFile);
const del = promisify(fs.unlink);

const errorTest = line => {
  // TODO: move this function to a separate file

  const tests = ["linelength"];
  const runners = {
    linelength: {
      error: line.split(",").length !== 5 ? true : false,
      message: "Each row should have 5 columns"
    }
  };
  const failures = tests
    .map(test => {
      return runners[test];
    })
    .filter(runner => {
      return runner.error;
    })
    .reduce((p, c) => {
      return (p += `${c.message}. `);
    }, "");
  return failures.length > 0 ? failures : false;
};

const createCsv = async fileName => {
  const inFolder = process.env.INPUT || "input";
  const dir = path.join(__dirname, "..", inFolder, `${fileName}.csv`);
  const outFolder = process.env.OUTPUT || "output";
  const outDir = path.join(__dirname, "..", outFolder, `${fileName}.json`);
  const errFolder = process.env.OUTPUT || "error";
  const errDir = path.join(__dirname, "..", errFolder, `${fileName}.csv`);
  if (fs.existsSync(outDir)) {
    try {
      await del(outDir);
    } catch (e) {
      console.log("Tried to delete file with same name but it was not there");
    }
  }
  if (fs.existsSync(errDir)) {
    try {
      await del(errDir);
    } catch (e) {
      console.log("Tried to delete file with same name but it was not there");
    }
  }

  var errorFlag = false;
  const error = fs.createWriteStream(errDir, {
    flags: "a"
  });
  error.write("LINE_NUM,ERROR_MSG");

  let jsonArray;
  try {
    jsonArray = await csv()
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
        // Right now we are only checking for line length and spill
        // We could do more for error handling by line here.

        const errors = errorTest(fileLineString);
        if (lineIdx > 0 && errors) {
          errorFlag = true;
          error.write(`\r\n${lineIdx},${errors}`);
          fileLineString = "";
        }

        return fileLineString;
      })
      .fromFile(dir);
  } catch (e) {
    console.error(
      "We tried to convert your file but encountered an error: ",
      e
    );
    process.exit;
  }

  error.end();

  if (!errorFlag) {
    del(errDir);
  }

  // There is a better way - but time is short
  jsonArray = jsonArray.map(line => {
    if (line.name.middle === "") {
      delete line.name.middle;
      //   return {
      //     ...line,
      //     name: {
      //       ...line.name.last,
      //       ...line.name.first
      //     }
      //   };
    }
    return line;
  });

  const cleanArray = jsonArray.filter(line => {
    return line !== "";
  });

  await write(outDir, JSON.stringify(cleanArray, null, 2), "utf8");
};

module.exports = createCsv;
