import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import Config from '../../config.json'

const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(Config.Gemini.ApiKey)
const model:GenerativeModel = genAI.getGenerativeModel({ model: Config.Gemini.Model })

export default model