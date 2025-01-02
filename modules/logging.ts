import fs from 'fs'

const logs: Array<(string | number)[]> = []
const root: string = process.cwd()

const add = (text: string) => {
  const date: Date = new Date()
  logs.push([
    `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    text
  ])
}

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

export default {
  add
}