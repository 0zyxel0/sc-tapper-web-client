import { writeFile } from "fs/promises"
import { v4 as uuidv4 } from 'uuid';
export default defineEventHandler(async (event) => {
  

  const formData: any = await readMultipartFormData(event)
  const file = formData.find((item: any) => item.name == 'file')

  const imgName = file.filename
  const ext = imgName?.split(".").pop();
  const newImageName = uuidv4() + "." + ext;
  const path = './public/uploads/' + newImageName
  console.log("Filename: ", imgName)
  await writeFile(path, file.data)
  return {
    path
  }
})
