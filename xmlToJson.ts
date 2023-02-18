import { downloadFile } from "./modules/downloadFile.js";
import { convertToJSON } from "./modules/convertToJson.js";
import fs from "fs";

const exampleXML =
  "https://firebasestorage.googleapis.com/v0/b/codebooth-a4b70.appspot.com/o/interview_test_case%2Ftest_.xml?alt=media&token=2d5a775e-7b61-4866-945e-e8d382bd1ca7";
const xmlFilePath = `./files/data.xml`;
const jsonFilePath = `./files/convertedFile.json`;

interface Output {
  id: number;
  listType: number;
  imagePath: string[];
}

const output: Output = { id: 0, listType: 0, imagePath: [] };

async function downloadImages(list: Array<string>) {
  for await (const image of list) {
    let outputLocationPath = `./files/${list.indexOf(image)}.jpg`;
    await downloadFile(image, outputLocationPath);
    output.imagePath.push(outputLocationPath);
  }
}

async function constructOutput() {
  const match = JSON.parse(fs.readFileSync("./files/convertedFile.json", {encoding:'utf8', flag:'r'}));
  output.id = Number(process.argv[2]);
  match.Realty.OfferType === "Rent"
    ? (output.listType = 2)
    : (output.listType = 1);
  await downloadImages(match.Realty.Pictures.Image);
}

(async () => {
  await downloadFile(exampleXML, xmlFilePath);
  convertToJSON(process.argv[2], xmlFilePath, jsonFilePath);
  await constructOutput();
  console.log(output);
})();
