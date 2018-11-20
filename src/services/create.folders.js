import fs from "fs";
import path from "path";

const dir = name => {
  return path.join(__dirname, "..", name);
};

const createFolders = async folders => {
  Object.keys(folders).map(key => {
    const d = dir(folders[key]);
    process.env[key.toUpperCase()] = folders[key];
    if (!fs.existsSync(d)) {
      fs.mkdirSync(d);
    }
  });
};

module.exports = createFolders;
