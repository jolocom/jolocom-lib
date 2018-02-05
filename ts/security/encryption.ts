import * as crypto from 'crypto'

export function initiateSecretExchange() {
  const setup = crypto.createDiffieHellman(1024) //2048 standard key strength currently
  const prime = setup.getPrime('hex')
  const initiator = crypto.createDiffieHellman(prime, 'hex')
  const initiatorKey = initiator.generateKeys('hex')

  const dhSet = {
    prime: prime,
    initiator: initiator,
    initiatorKey: initiatorKey
  }
  return dhSet
}


export function respondSecretExchange({prime} : {prime: string}) {
  const responder = crypto.createDiffieHellman(prime, 'hex')
  const responderKey = responder.generateKeys('hex')

  const dhSet = {
    responder: responder,
    responderKey: responderKey
  }
  return dhSet
}


export function getEncryptionSecret({party, pubKey} : {party: any, pubKey: string}) {
  return party.computeSecret(pubKey, 'hex')
}


export function encrypt({key, plainText} : {key: any, plainText: any}) : string {
  const cipher = crypto.createCipher('aes-128-ctr', key)
  let cipherText = cipher.update(JSON.stringify(plainText),'utf8','hex')
  cipherText += cipher.final('hex')

  return cipherText
}

export function decrypt({key, cipherText} : {key: any, cipherText: string}) {
  var decipher = crypto.createDecipher('aes-128-ctr', key)
  var plainText = decipher.update(cipherText,'hex','utf8')
  plainText += decipher.final('utf8')

  return JSON.parse(plainText)
}
