// @ts-ignore
import CodeMirror from 'codemirror'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { CodemirrorBinding } from 'y-codemirror'
import 'codemirror/mode/javascript/javascript.js'
import { getCryptor, getShareLink } from './src/helpers.js'

const cryptor = getCryptor()

function isViewOnly () {
  return typeof cryptor.signKey === 'undefined'
}

window.addEventListener('load', () => {
  const ydoc = new Y.Doc()
  const provider = new WebsocketProvider(
    'ws://localhost:1234', // server
    cryptor.chanId, // roomname
    ydoc,
    { cryptor }
  )
  const ytext = ydoc.getText('codemirror')
  const editorContainer = document.getElementById('editor')
  // document.body.insertBefore(editorContainer, null)

  const editor = CodeMirror(editorContainer, {
    mode: 'javascript',
    lineNumbers: true,
    readOnly: isViewOnly()
  })
  const binding = new CodemirrorBinding(ytext, editor, provider.awareness)

  const connectBtn = /** @type {HTMLElement} */ (document.getElementById('y-connect-btn'))
  connectBtn.addEventListener('click', () => {
    if (provider.shouldConnect) {
      provider.disconnect()
      connectBtn.textContent = 'Connect'
    } else {
      provider.connect()
      connectBtn.textContent = 'Disconnect'
    }
  })

  // @ts-ignore
  window.example = { provider, ydoc, ytext, binding, Y }

  function copy2Clipboard (text) {
    return () => {
      const selBox = document.createElement('textarea')
      selBox.style.position = 'fixed'
      selBox.style.left = '0'
      selBox.style.top = '0'
      selBox.style.opacity = '0'
      selBox.value = text
      document.body.appendChild(selBox)
      selBox.focus()
      selBox.select()
      document.execCommand('copy')
      document.body.removeChild(selBox)
      // alert('text copied to clipboard')
    }
  }

  if (!isViewOnly()) {
    const editShareURL = getShareLink(cryptor, true)
    document.getElementById('shareEditText').innerHTML = '<br>Copy link: ' + editShareURL
    document.getElementById('share-edit-btn').addEventListener('click',
      copy2Clipboard(editShareURL)
    )
  } else {
    document.getElementById('share-edit-btn').remove()
    document.getElementById('editTitle').remove()
  }

  const viewShareURL = getShareLink(cryptor, false)
  document.getElementById('shareViewText').innerHTML = '<br>Copy link: ' + viewShareURL
  document.getElementById('share-view-btn').addEventListener('click',
    copy2Clipboard(viewShareURL)
  )
})
