/**
 * @license
 * Copyright 2025 SGStudio Under Syeif Sultoni Akbar
 * 
 * Licensed under GNU General Public License Version 3 (the "License")
 * For more information on this, see
 * 
 *  https://www.gnu.org/licenses/
 * 
 * To "modify" a work means to copy from or adapt all or part of the work
 * in a fashion requiring copyright permission, other than the making of an
 * exact copy.  The resulting work is called a "modified version" of the
 * earlier work or a work "based on" the earlier work.
 */

import type { ChatSession, Content, GenerateContentResult, Part } from "@google/generative-ai";
import logging from "../logging";
import model from "./connection";
import chatHistoryParser from "./chatHistoryParser";
import type { CharResult } from ".";

/**
 * Generate some standard AI answer from Text Based Prompt.
 * @public
 */
const textPrompt = async (Prompt: string): Promise<string | null> => {
  try {
    const result: GenerateContentResult = await model.generateContent(Prompt)
    return result.response.text()
  } catch (err) {
    logging.add(`${err}`)
    return null
  }
}

/**
 * Generate some standard AI answer from Text & Multiple Image Prompt.
 * @public
 */
const imagePrompt = async (Prompt: string, ImageListBuffer: ArrayBuffer[]): Promise<string | null> => {
  try {
    const promptWithImage: (string | Part)[] = []

    // for (const imageLink of ImageListLink) {
    //   const link: ArrayBuffer = await fetch(imageLink).then((response) => response.arrayBuffer())
    //   promptWithImage.push({
    //     inlineData: {
    //       data: Buffer.from(link).toString('base64'),
    //       mimeType: 'image/jpeg'
    //     }
    //   })
    // }

    for (const imageBuffer of ImageListBuffer) {
      promptWithImage.push({
        inlineData: {
          data: Buffer.from(imageBuffer).toString('base64'),
          mimeType: 'image/jpeg'
        }
      })
    }
    promptWithImage.push(Prompt)

    const result: GenerateContentResult = await model.generateContent(promptWithImage);
    return result.response.text()
  } catch (err) {
    logging.add(`${err}`)
    return null
  }
}

/**
 * Generate some AI answer from Text Based Prompt with his own Character.
 * @public
 */
const charTextPrompt = async (Prompt: string, ChatHistory: Content[] | null): Promise<CharResult | null> => {
  try {
    const chatSession: ChatSession = model.startChat({
      history: chatHistoryParser.toHistory(ChatHistory)
    })
    const result: GenerateContentResult = await chatSession.sendMessage(Prompt)
    return {
      result: result.response.text(),
      history: chatHistoryParser.fromHistory(await chatSession.getHistory())
    }
  } catch (err) {
    logging.add(`${err}`)
    return null
  }
}

/**
 * Generate some AI answer from Text & Multiple Image Prompt with his own Character.
 * @public
 */
const charImagePrompt = async (Prompt: string, ImageListBuffer: ArrayBuffer[], ChatHistory: Content[] | null): Promise<CharResult | null> => {
  try {
    const promptWithImage: (string | Part)[] = []
    const chatSession: ChatSession = model.startChat({
      history: chatHistoryParser.toHistory(ChatHistory)
    })

    // for (const imageLink of ImageListLink) {
    //   const link: ArrayBuffer = await fetch(imageLink).then((response) => response.arrayBuffer())
    //   promptWithImage.push({
    //     inlineData: {
    //       data: Buffer.from(link).toString('base64'),
    //       mimeType: 'image/jpeg'
    //     }
    //   })
    // }

    for (const imageBuffer of ImageListBuffer) {
      promptWithImage.push({
        inlineData: {
          data: Buffer.from(imageBuffer).toString('base64'),
          mimeType: 'image/jpeg'
        }
      })
    }

    promptWithImage.push(Prompt)

    const result: GenerateContentResult = await chatSession.sendMessage(promptWithImage)
    return {
      result: result.response.text(),
      history: chatHistoryParser.fromHistory(await chatSession.getHistory())
    }
  } catch (err) {
    logging.add(`${err}`)
    return null
  }
}

/**
 * Some powerfull function to send some prompt to API.
 * @public
 */
export default {
  textPrompt,
  imagePrompt,
  charTextPrompt,
  charImagePrompt
}