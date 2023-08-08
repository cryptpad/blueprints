const Crypto = require('chainpad-crypto')

function getFragmentID () {
  const hash = window.location.hash

  // '#/edit/SEED'
  // '#/view/SEED'
  const fragmentID = hash.substring(1)
  if (fragmentID === '') {
    return null
  }

  return fragmentID
}

function setFragmentID (fragmentID) {
  window.location.hash = '#/edit/' + fragmentID
}

export function getCryptor () {
  let cryptor
  const fragmentID = getFragmentID()

  if (fragmentID == null) {
    cryptor = Crypto.createEditCryptor2()
    setFragmentID(cryptor.editKeyStr)
  } else {
    const type = fragmentID.substring(1, 5) // edit | view
    const keystr = fragmentID.substring(6)

    if (type === 'edit') {
      cryptor = Crypto.createEditCryptor2(keystr)
    } else if (type === 'view') {
      cryptor = Crypto.createViewCryptor2(keystr.slice(0, 43))
      cryptor.validateKey = keystr.slice(43)
    }
  }

  return cryptor
}

export function getShareLink (cryptor, isEdit) {
  let mode
  let keystr
  if (cryptor.editKeyStr && isEdit) {
    mode = 'edit'
    keystr = cryptor.editKeyStr
  } else {
    mode = 'view'
    keystr = cryptor.viewKeyStr + cryptor.validateKey
  }

  return window.location.origin + window.location.pathname +
    '#/' + mode + '/' + keystr
}
