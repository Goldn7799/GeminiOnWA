import type { GenerateContentResult, Part } from "@google/generative-ai";
import logging from "../logging";
import model from "./connection";

const textPrompt = async (prompt: string): Promise<string | boolean> => {
  try {
    const result: GenerateContentResult = await model.generateContent(prompt)
    return result.response.text()
  } catch (err) {
    logging.add(`${err}`)
    return false
  }
}

const imagePrompt = async (prompt: string, imageListLink: string[]): Promise<string | boolean> => {
  const promptWithImage: (string | Part)[] = []

  try {
    for (const imageLink of imageListLink) {
      const link: ArrayBuffer = await fetch(imageLink).then((response) => response.arrayBuffer())
      promptWithImage.push({
        inlineData: {
          data: Buffer.from(link).toString('base64'),
          mimeType: 'image/jpeg'
        }
      })
    }

    promptWithImage.push(prompt)

    const result: GenerateContentResult = await model.generateContent(promptWithImage);
    return result.response.text()
  } catch (err) {
    logging.add(`${err}`)
    return false
  }
}

export default {
  textPrompt,
  imagePrompt
}