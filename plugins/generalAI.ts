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

import { downloadMediaMessage, getContentType, type WAMessage, type WASocket } from "@whiskeysockets/baileys";
import { prompt } from "../modules/Gemini";
import smallDB from "../modules/WhatsApp/smallDB";
import geminiParser from "../modules/WhatsApp/geminiParser";
import utility from "../modules/WhatsApp/utility";
import logging from "../modules/logging";

/**
 * Default WhatsApp Response from AI({@link prompt}).
 * @public
 */
const generalAI = async (sock: WASocket, msg: WAMessage): Promise<boolean> => {
  try {
    if (!msg.key.fromMe && msg.message) {

      /**
       * This is a Chat Session Key.
       */
      const session = msg.key.remoteJid!

      /**
       * Additional check for tag on Captioned Image on Grub.
       */
      const msgType = getContentType(msg.message)
      const rawCaption = JSON.parse(JSON.stringify(msg.message[`${(msgType) ? msgType : 'imageMessage'}`]))
      const caption = (rawCaption?.caption) ? `${rawCaption?.caption}` : ''
      
      /**
       * Check if the chat is suitable for a response.
       */
      const pcCheck = (): boolean => session.includes('@s.whatsapp.net')
      const gcCheck = (): boolean => session.includes('@g.us')
      const tagsCheck = (): boolean => ((msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.includes(`${sock.user?.id.split(':')[0]}@s.whatsapp.net`))) || caption.includes(`${sock.user?.id.split(':')[0]}`) 
      const replyCheck = (): boolean | undefined => (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) ? (msg.message.extendedTextMessage.contextInfo.participant?.includes(`${sock.user?.id.split(':')[0]}@s.whatsapp.net`)) : false
      if (pcCheck() || ( gcCheck() && (tagsCheck() || replyCheck()) )) {
        /**
         * Indicator if chat being responded.
         */
        await sock.readMessages([msg.key])
        await sock.sendPresenceUpdate('composing', session)
        
        const thisHistory = (smallDB.check(session)) ? smallDB.get(session) : null
        const thisMessageText = ((msg.message?.conversation) ? msg.message.conversation : msg.message.extendedTextMessage?.text)?.replaceAll(`@${sock.user?.id.split(':')[0]}`, '')
        const replyMessage = msg.message.extendedTextMessage?.contextInfo?.quotedMessage
        const replyMessageText = replyMessage?.conversation?.replaceAll(`@${sock.user?.id.split(':')[0]}`, '')

        /**
         * This List to collect Image Buffer From 2 Source.
         */
        const imageList: ArrayBuffer[] = []
        const rmsg: WAMessage = {
          key: msg.key,
          message: replyMessage
        }
        const thisMedia = (msg.message?.imageMessage || msg.message?.stickerMessage) ? await downloadMediaMessage(msg, 'buffer', {}) : null
        const replyMedia = (replyMessage?.imageMessage || replyMessage?.stickerMessage) ? await downloadMediaMessage(rmsg, 'buffer', {}) : null
        if (thisMedia) imageList.push(utility.toArrayBuffer(thisMedia));
        if (replyMedia) imageList.push(utility.toArrayBuffer(replyMedia));

        /**
         * Choose wich one AI Prompt to be use.
         */
        const aiRes = (imageList)
        ? await prompt.charImagePrompt(`${(replyMessageText) ? `([Reply From Message]${(replyMedia) ? `[First Image is Reply From Message]` : ''} "${replyMessageText}")` : ''}${thisMessageText}`, imageList, thisHistory)
        : await prompt.charTextPrompt(`${(replyMessageText) ? `([Reply From Message] "${replyMessageText}")` : ''}${thisMessageText}`, thisHistory)
  
        /**
         * If response Avaiable, send it to user.
         */
        if (aiRes) {
          smallDB.update(session, aiRes?.history)
          await sock.sendMessage(session, { text: geminiParser(`${aiRes?.result}`) }, { quoted: msg })
          await sock.sendPresenceUpdate('available', session)
          return true
        } else return false
      } else return false
    } else return false
  } catch (err) {
    await sock.sendMessage(msg.key.remoteJid!, { text: "Yah Media nya gak bisa ke download :<" }, { quoted: msg })
    await sock.sendPresenceUpdate('available', msg.key.remoteJid!)
    logging.add(`${err}`)
    return true
  }
}

export default generalAI