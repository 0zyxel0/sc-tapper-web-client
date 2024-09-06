import fs from 'fs'
import * as formidable from 'formidable';
// import { Files, Fields } from 'h3-formidable';
import path from 'path'



export default defineEventHandler(async (event) => {
  const form = new formidable.IncomingForm()

  form.uploadDir = './public/uploads';

  return new Promise((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      // console.log("File", files.image)
      // const oldPath = files.image.filepath;
      // const newPath = form.uploadDir + '/' + files.image.originalFilename;

      // const readStream = createReadStream(oldPath);
      // const writeStream = createWriteStream(newPath);

      // readStream.pipe(writeStream);

      // writeStream.on('close', () => {
      //   resolve({
      //     status: 'success',
      //     path: newPath
      //   });
      // });

      // writeStream.on('error', (error) => {
      //   reject(error);
      // });
      console.log("FIle", files.image[0])
      const imgName = files.image[0].originalFilename
      const ext = imgName?.split(".").pop();
      const oldPath = files.image[0].filepath;
      const newName = files.image[0].newFilename + "." + ext;
      const newPath = path.join(process.cwd(), 'public/uploads', newName )
      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          reject(err)
          return
        }
        resolve({ message: 'File uploaded successfully' })
      })

    });
  })
})
