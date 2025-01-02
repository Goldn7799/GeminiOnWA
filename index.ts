import parser from "./modules/WhatsApp/parser";
import { prompt } from './modules/Gemini/index';

prompt.textPrompt("Halo")
prompt.imagePrompt('p', ['a'])
console.log('a')

// console.log(parser("* **HALO**"))