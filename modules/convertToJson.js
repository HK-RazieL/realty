import fs from "fs";
import xml2js from "xml2js";

export function convertToJSON(id, xmlFilePath, jsonFilePath) {
  try {
    let fileData = fs.readFileSync(xmlFilePath, "ascii");
    let parser = xml2js.Parser({ explicitArray: false });
    let match;
    parser.parseString(fileData, function (err, result) {
      result.root.row.find((element) => {
        if (element.Realty.UniqueId == id) {
          fs.writeFileSync(jsonFilePath, JSON.stringify(element, null, 2));
          return;
        }
      });
    });
  } catch (error) {
    console.log(`Error converting XML to JSON: ${error}`);
  }
}