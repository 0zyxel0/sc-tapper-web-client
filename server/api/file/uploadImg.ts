import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
export default defineEventHandler(async (event) => {
  console.log("UUID: ", uuidv4());
  // const { files: { photo: [{ filepath, mimetype}]}} = await readFiles(event, {
  //   includeFields: true
  // });

  // let imageName = String(Date.now()) + String(Math.round(Math.random() * 10000000));
  // let newPath = `${path.join("public", "uploads", imageName)}.${ mimetype.split('/')[1] }`;
  // fs.copyFileSync(filepath, newPath);

  const files = await readMultipartFormData(event)

  const uploadedFilePaths: string[] = []

  files?.forEach((file) => {
    const imgName = file.filename;
    const ext = imgName?.split(".").pop();
    console.log("New Name", ext);
    file.filename = uuidv4() + "." + ext;
    const filePath = path.join(
      process.cwd(),
      'public/uploads',
      file.filename as string,
    )
    console.log("file", file)
    fs.writeFileSync(filePath, file.data)
    uploadedFilePaths.push(`${file.filename}`)
  })
  return uploadedFilePaths;
  
})
