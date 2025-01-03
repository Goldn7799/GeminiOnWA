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

import type { Content } from "@google/generative-ai";
import prompt from "./prompt";

/**
 * Gemini AI Modules.
 * @public
 */
export {
  prompt
}

/**
 * Structure of Result AI Answer with Character.
 * @public
 */
export declare interface CharResult {
  result: string,
  history: Content[]
}