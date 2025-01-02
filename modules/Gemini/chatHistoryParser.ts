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

import type { Content } from '@google/generative-ai'
import Config from '../../config.json'

/**
 * Add A Character Prompt from {@link Config} to Chat History({@link Content}), make AI use more powerfull answer.
 * @public
 */
const toHistory = (UserHistory: Content[] | null): Content[] => {
  const character: Content[] = [
    { role: 'user', parts: [{ text: Config.Gemini.Character.MainChar }]},
    { role: 'model', parts: [{ text: Config.Gemini.Character.AllrightResponse }]}
  ]
  const history: Content[] = (UserHistory) ? character.concat(UserHistory) : character;
  return history
}

/**
 * Remove A Character Prompt from function {@link toHistory} on Chat History({@link Content}) to save Database.
 * @public
 */
const fromHistory = (History: Content[]): Content[] => {
  const thisHistory: Content[] = History;
  thisHistory.shift();
  thisHistory.shift();
  return thisHistory
}

/**
 * Parse A ChatHistory with AI Character Prompt.
 * @public
 */
export default {
  toHistory,
  fromHistory
}
