import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI: any = new GoogleGenerativeAI("AIzaSyB7u6aTxnQhWr0XCFVMNm5p_1bh8zqOtE8")
const model: any = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

const prompt: any = "Sebutkan 2 hewan pemakan daging beserta foto nya"

const result: any = await model.generateContent(prompt)
console.log(result.response.text())

// const imageResp: any = await fetch(
//   'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall.jpg/2560px-Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall.jpg'
// )
//   .then((response) => response.arrayBuffer());

// const result: any = await model.generateContent([
//   {
//       inlineData: {
//           data: Buffer.from(imageResp).toString("base64"),
//           mimeType: "image/jpeg",
//       },
//   },
//   'Jelaskan, Gambar Apa ini.',
// ]);
// console.log(result.response.text());
// console.log(JSON.stringify(result))