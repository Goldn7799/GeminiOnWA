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
import fs from 'fs'
import logging from '../logging'

/**
 * Directory of Where the Data stored.
 */
const root: string = `${process.cwd()}/DataStore`

/**
 * Temporary Chat History before saved to file.
 */
let chatHistory: Record<string, Content[]> = {}

/**
 * Initial and Read saved DB.
 */
fs.mkdir(root, () => {
  fs.readFile(`${root}/chat-history.json`, 'utf-8', (err, res) => {
    if (err) {
      fs.writeFile(`${root}/chat-history.json`, JSON.stringify(chatHistory), (err) => {
        if (err) {
          logging.add(`${err}`)
        };
        SYNC()
      })
    } else {
      chatHistory = JSON.parse(res)
      SYNC()
    }
  })
})

/**
 * SYNC Temporary and DB.
 */
const SYNC = () => {
  fs.writeFile(`${root}/chat-history.json`, JSON.stringify(chatHistory), (err) => {
    if (err) {
      logging.add(`${err}`)
    };
    setTimeout(() => {
      SYNC()
    }, 2500);
  })
}

/**
 * Update Chat History Data.
 * @public
 */
const update = (key: string, data: Content[]) => {
  chatHistory[key] = data;
}

/**
 * Get saved Chat History.
 * @public
 */
const get = (key: string): Content[] | null => {
  return chatHistory[key]
}

/**
 * Check if Chat History is Avaiable or Not.
 * @public
 */
const check = (key: string): boolean => {
  return Object.keys(chatHistory).includes(key)
}

/**
 * Small DB to store some little data and lightweight.
 * @public
 */
export default {
  update,
  get,
  check
}