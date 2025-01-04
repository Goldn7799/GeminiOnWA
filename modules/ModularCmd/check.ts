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

import type { WAMessage, WASocket } from "@whiskeysockets/baileys"
import generalAI from "../../plugins/generalAI"
import statusAutoRead from "../../plugins/statusAutoRead"
import spamProtection from "../WhatsApp/spamProtection"

/**
 * Check Conversation to system, and reply it if avaiable.
 * @public
 */
const check = async (sock: WASocket, msg: WAMessage) => {
  let isCompleting: boolean = false

  //// PUGIN PLACE ////
  // Make isCompleting to true if Bot send a Feedback to Protect from Spam.

  if (await generalAI(sock, msg)) isCompleting = true
  await statusAutoRead(sock, msg)
  
  //// END PLUGIN PLACE ////

  /**
   * Check the Completing and add ChatCount.
   */
  if (isCompleting) {
    const thisParticipant = (msg.participant) ? msg.participant : (msg.key.participant) ? msg.key.participant : (msg.key.remoteJid) ? msg.key.remoteJid : ''
    spamProtection.addChatCount(thisParticipant)
  };
}

export default check