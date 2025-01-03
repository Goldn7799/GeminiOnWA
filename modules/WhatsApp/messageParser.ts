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

/**
 * Parse a WAMessage for easy development
 * @public
 */
const messageParser = (sock: WASocket, msg: WAMessage) => {
  console.log('aik')
  throw sock
  throw msg
}

export default messageParser