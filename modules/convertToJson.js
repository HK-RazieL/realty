import fs from "fs";
import xml2js from "xml2js";

export function convertToJSON(id, xmlFilePath, jsonFilePath) {
  return new Promise((resolve, reject) => {
    try {
      const fileData = fs.readFileSync(xmlFilePath, "ascii");
      const parser = xml2js.Parser({ explicitArray: false });
      parser.parseString(fileData, function (err, result) {
        const match = result.root.row.find((element) => {
          return element.Realty.UniqueId == id ? element : false;
        });
        if (match) {
          fs.writeFile(jsonFilePath, JSON.stringify(match, null, 2), (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        } else {
          reject("Id doesn't exist");
        }
      });
    } catch (error) {
      reject(`Error converting XML to JSON: ${error}`);
    }
  });
}
