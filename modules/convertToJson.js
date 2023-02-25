import fs from "fs";
import xml2js from "xml2js";

export function convertToJSON(id, xmlFilePath, jsonFilePath) {
  try {
    const fileData = fs.readFileSync(xmlFilePath, "ascii");
    const parser = xml2js.Parser({ explicitArray: false });
    parser.parseString(fileData, function (err, result) {
      const match = result.root.row.find((element) => {
        return element.Realty.UniqueId == id ? element : false;
      });
      if (match) {
        fs.writeFileSync(jsonFilePath, JSON.stringify(match, null, 2));
      } else {
        console.log("Id doesn't exist");
        process.exit(1);
      }
    });
  } catch (error) {
    console.log(`Error converting XML to JSON: ${error}`);
  }
}