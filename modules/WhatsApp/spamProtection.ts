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

import type { WASocket } from "@whiskeysockets/baileys";

interface SpamProtectionData {
  chatCount: number,
  timer: number,
  alreadyGetWarning: boolean
}

/**
 * This is A Temporary Data of how many user chat.
 */
const temp: Record<string, SpamProtectionData> = {}

/**
 * Reset Data every 60sec.
 */
setInterval(() => {
  for (const thisDataId in temp) {
    const thisData = temp[thisDataId]
    if (thisData.timer >= 60) {
      delete temp[thisDataId]
    } else {
      temp[thisDataId].timer = thisData.timer + 1
    }
  }
}, 1000);

/**
 * Check if user not Limited.
 * @public
 */
const check = (userJid: string, remoteJid: string, sock: WASocket): boolean => {
  const thisUserData = temp[userJid]

  if (thisUserData) {
    if (thisUserData.chatCount >= 16) {
      if (!thisUserData.alreadyGetWarning) {
        temp[userJid].alreadyGetWarning = true
        sock.sendMessage(remoteJid, { text: `TOLONG JANGAN SPAM! *[Cooldown ${60 - thisUserData.timer}s]*` })
      };
      return false
    } else {
      return true
    }
  } else return true
  }

/**
 * To add count of Chat if bot responded.
 * @public
 */
const addChatCount = (userJid: string) => {
  const thisUserData = temp[userJid]

  if (thisUserData) {
    temp[userJid].chatCount = (thisUserData.chatCount + 1)
  } else {
    temp[userJid] = {
      chatCount: 1,
      timer: 0,
      alreadyGetWarning: false
    }
  }
}

/**
 * Protect toxic user with AntiSpam.
 * @public
 */
export default {
  check,
  addChatCount
}