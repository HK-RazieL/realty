import { downloadFile, convertToJSON } from "./modules/index.ts";
import fs from "fs";

// example IDs "47608654301" or  "25679622473" or  "23466772338"

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
  let index = 0;
  for await (const image of list) {
    try {
      const outputLocationPath = `./files/${index}.jpg`;
      await downloadFile(image, outputLocationPath);
      output.imagePath.push(outputLocationPath);
      index++
    } catch (error) {
      console.log(`Error downloading image: ${error}`);
    }
  }
}

async function constructOutput() {
  try {
    const match = JSON.parse(fs.readFileSync("./files/convertedFile.json", {encoding:'utf8', flag:'r'}));
    output.id = Number(process.argv[2]);
    match.Realty.OfferType === "Rent"
      ? (output.listType = 2)
      : (output.listType = 1);
    await downloadImages(match.Realty.Pictures.Image);
  } catch (error) {
    console.log(`Error constructing output: ${error}`);
  }
}

(async () => {
  try {
    await downloadFile(exampleXML, xmlFilePath);
    convertToJSON(process.argv[2], xmlFilePath, jsonFilePath);
    await constructOutput();
    console.log(output);
  } catch (error) {
    console.log("Error executing main function: ${error}")
  }
})();
