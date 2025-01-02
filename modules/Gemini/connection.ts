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

import { DynamicRetrievalMode, GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import Config from '../../config.json'

/**
 * Default Initial for {@link GoogleGenerativeAI} and set APIKEY from {@link Config}.
 * @public
 */
const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(Config.Gemini.ApiKey)

/**
 * AI Model with APIKEY included from the {@link Config} and set GoogleSearchRetrieval or Grounding.
 * @public
 */
const model:GenerativeModel = genAI.getGenerativeModel({
  model: Config.Gemini.Model,
  tools: [
    {
      googleSearchRetrieval: {
        dynamicRetrievalConfig: {
          mode: DynamicRetrievalMode.MODE_DYNAMIC,
          dynamicThreshold: Config.Gemini.GroundingTreshold
        }
      }
    }
  ]
})

export default model