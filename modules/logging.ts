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

import fs from 'fs'

/**
 * Local Variable to store some logs.
 * @public
 */
const logs: Array<(string | number)[]> = []

/**
 * Root Path on process.
 * @public
 */
const root: string = process.cwd()

/**
 * Add A log to {@link logs}.
 * @public
 */
const add = (Text: string) => {
  const date: Date = new Date()
  console.log(`[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${Text}`)
  logs.push([
    `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    Text
  ])
}

/**
 * Sync data from {@link logs} to File on logs folder.
 * @public
 */
let coutFile: number = 1;
fs.readdir(`${root}/logs`, (err, res) => {
  if (!err) {
    coutFile = res.length + 1;
  };

  let logFileName: string = ''
  let currentDay = new Date().getDate()
  const UpdateFileName = () => {
    const date: Date = new Date()
    logFileName = `[ ${date.getHours()}:${date.getMinutes()} - ${date.getDate()}|${date.getMonth() + 1}|${date.getFullYear()} ] Gemini On WhatsApp Logs (${coutFile})`
  }
  UpdateFileName();

  const syncLogFile = () => {
    fs.mkdir(`${root}/logs`, () => {
      let theLogs: string = ''
      for (const thisLog of logs) {
        theLogs += `[${thisLog[0]}] ${thisLog[1]}
  `
      }
      fs.writeFile(`${root}/logs/${logFileName}.txt`, theLogs, 'utf-8', () => {
        setTimeout(() => {
          currentDay = new Date().getDate()
          if (currentDay !== new Date().getDate()) {
            UpdateFileName()
          };
          syncLogFile()
        }, 650);
      })
    })
  }
  syncLogFile()
})

/**
 * Some logging function to replace default {@link Console.log} with logging file.
 * @public
 */
export default {
  add
}