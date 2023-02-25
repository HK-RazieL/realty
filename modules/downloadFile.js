import axios from "axios";
import fs from 'fs';

export async function downloadFile(fileUrl, outputLocationPath) {
  try {
    const writer = fs.createWriteStream(outputLocationPath);
  
    return axios({
      method: "get",
      url: fileUrl,
      responseType: "stream",
    }).then((response) => {
      return new Promise((resolve, reject) => {
        response.data.pipe(writer);
        let error = null;
        writer.on("error", (err) => {
          error = err;
          writer.close();
          reject(err);
        });
        writer.on("close", () => {
          if (!error) {
            resolve(true);
          }
        });
      });
    });
  } catch (error) {
    console.log(`Error downloading file: ${error}`);
  }
}