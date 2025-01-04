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

import type { WAMessage, WASocket } from "@whiskeysockets/baileys";
import logging from "../modules/logging";

/**
 * Auto Read user status if avaiable.
 * @public
 */
const statusAutoRead = async (sock: WASocket, msg: WAMessage) => {
  try {
    if (msg.key.remoteJid?.includes('status@broadcast')) {
      await sock.readMessages([msg.key])
      console.log(`[> Read ${msg.key.participant} Status <]`)
    };
  } catch (err) {
    await sock.sendMessage(msg.key.remoteJid!, { text: "Yah Media nya gak bisa ke download :<" }, { quoted: msg })
    await sock.sendPresenceUpdate('available', msg.key.remoteJid!)
    logging.add(`${err}`)
  }
}

export default statusAutoRead