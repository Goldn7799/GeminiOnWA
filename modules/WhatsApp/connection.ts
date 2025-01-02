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

import makeWASocket, { Browsers, DisconnectReason, downloadMediaMessage, useMultiFileAuthState, type WASocket } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import logging from "../logging";
import { prompt } from "../Gemini";
import smallDB from "./smallDB";
import parser from "./parser";
import utility from "./utility";

/**
 * Try To Connect to WhatsApp services using Baileys
 * @public
 */
const tryConnect = async () => {
  /**
   * Basic Initial for Baileys
   * @public
   */
  const { state, saveCreds } = (await useMultiFileAuthState('./DataStore/WhatsAppState'))
  const sock: WASocket = makeWASocket({
    auth: state,
    browser: Browsers.ubuntu('GeminiOnWA'),
    printQRInTerminal: true
  })

  /**
   * Save WhatsApp Connection State
   * @public
   */
  sock.ev.on('creds.update', saveCreds)

  /**
   * Check if Whatsapp Connected, Disconnected and Connecting.
   * Auto Reconnect Feature.
   * @public
   */
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'connecting') {
      logging.add('Conneting...')
    };
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
      logging.add(`Connection Closed Due To ${lastDisconnect?.error}, Reconneting ${shouldReconnect}`)

      if (shouldReconnect) {
        tryConnect()
      };
    } else if (connection === 'open') {
      logging.add('Opened Connection')
      await sock.sendPresenceUpdate('available')
    };
  })

  /**
   * Reciving A Message from WhatsApp
   * @public
   */
  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    console.log(`${(msg.key.fromMe) ? '[AI] ' : ''}${msg.key.remoteJid} => ${msg.message?.conversation}`)
    if (!msg.key.fromMe) {
      const session = msg.key.remoteJid!
      const thisHistory = (smallDB.check(session)) ? smallDB.get(session) : null
      
      /**
     * Private Chat Reply Function
     * @public
     */
      if (session.includes('@s.whatsapp.net')) {

        /**
         * Image & Sticker Response
         * @public
         */
        if (msg.message?.imageMessage || msg.message?.stickerMessage) {
          const thisMedia = await downloadMediaMessage(msg, 'buffer', {})

          await sock.readMessages([msg.key])
          await sock.sendPresenceUpdate('composing', session)

          const aiRes = await prompt.charImagePrompt(`${msg.message?.conversation}`, utility.toArrayBuffer(thisMedia), thisHistory)

          if (aiRes) {
            smallDB.update(session, aiRes?.history)
            await sock.sendMessage(session, { text: parser(`${aiRes?.result}`) })
            await sock.sendPresenceUpdate('available', session)
          }
        }
        /**
         * Default Text Response
         * @public
         */
        else {
          await sock.readMessages([msg.key])
          await sock.sendPresenceUpdate('composing', session)

          const aiRes = await prompt.charTextPrompt(`${msg.message?.conversation}`, thisHistory)

        if (aiRes) {
          smallDB.update(session, aiRes?.history)
          await sock.sendMessage(session, { text: parser(`${aiRes?.result}`) })
          await sock.sendPresenceUpdate('available', session)
        };
        }
      };
    }
  })
}

/**
 * Main Connection Function
 * @public
 */
export default {
  tryConnect
}