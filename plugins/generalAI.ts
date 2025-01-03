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

import { downloadMediaMessage, type WAMessage, type WASocket } from "@whiskeysockets/baileys";
import { prompt } from "../modules/Gemini";
import smallDB from "../modules/WhatsApp/smallDB";
import parser from "../modules/WhatsApp/parser";
import utility from "../modules/WhatsApp/utility";

/**
 * Default WhatsApp Response from AI({@link prompt})
 * @public
 */
const generalAI = async (sock: WASocket, msg: WAMessage) => {
  if (!msg.key.fromMe && msg.message) {
    /**
     * This is a Chat Session Key
     */
    const session = msg.key.remoteJid!
    
    /**
     * Check if the chat is suitable for a response 
     */
    if (session.includes('@s.whatsapp.net') || (session.includes('@g.us') && msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.includes(`${sock.user?.id.split(':')[0]}@s.whatsapp.net`))) {
      const thisHistory = (smallDB.check(session)) ? smallDB.get(session) : null
      const thisMessageText = (msg.message?.conversation) ? msg.message.conversation : msg.message.extendedTextMessage?.text
      const replyMessage = msg.message.extendedTextMessage?.contextInfo?.quotedMessage
      const thisMedia = (msg.message?.imageMessage || msg.message?.stickerMessage) ? await downloadMediaMessage(msg, 'buffer', {}) : null
      // const replyMessageMedia = (replyMessage?.imageMessage || replyMessage?.stickerMessage) ? await downloadMediaMessage(messageParser(sock, msg), 'buffer', {}) : null

      /**
       * Indicator if chat being responded 
       */
      await sock.readMessages([msg.key])
      await sock.sendPresenceUpdate('composing', session)

      /**
       * Choose wich one AI Prompt to be use 
       */
      const aiRes = (thisMedia)
      ? await prompt.charImagePrompt(`${(replyMessage?.conversation) ? `([Reply From Message] "${replyMessage?.conversation}")` : ''}${thisMessageText}`, [utility.toArrayBuffer(thisMedia)], thisHistory)
      : await prompt.charTextPrompt(`${(replyMessage?.conversation) ? `([Reply From Message] "${replyMessage?.conversation}")` : ''}${thisMessageText}`, thisHistory)

      /**
       * If response Avaiable, send it to user 
       */
      if (aiRes) {
        smallDB.update(session, aiRes?.history)
        await sock.sendMessage(session, { text: parser(`${aiRes?.result}`) }, { quoted: msg })
        await sock.sendPresenceUpdate('available', session)
      }
    };
  }
}

export default generalAI