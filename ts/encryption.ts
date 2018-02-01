import * as crypto from 'crypto'

export function initiateSecretExchange() {
  const setup = crypto.createDiffieHellman(1024) //2048 standard key strength currently
  const prime = setup.getPrime('hex') // this is the the value that can be shared with anyone
  const initiator = crypto.createDiffieHellman(Buffer.from(prime))
  const initiatorKey = initiator.generateKeys()

  const dhSet = {
    prime: prime, // hex string included in token
    initiator: initiator, // stays a buffer
    initiatorKey: initiatorKey.toString('hex') // hex string included in token
  }
  return dhSet
}


export function respondSecretExchange(prime : string) {
  const responder = crypto.createDiffieHellman(Buffer.from(prime))
  const responderKey = responder.generateKeys()
  const dhSet = {
    responder: responder,
    responderKey: responderKey.toString('hex') // hex string included in token
  }
  return dhSet
}


export function getEncryptionSecret(party: any, pubKey : any) {
  return party.computeSecret(pubKey)
}


export function encrypt(key, data) {
  const cipher = crypto.createCipher('aes-128-ctr', key)
  // let cipherText = cipher.update(JSON.stringify(data),'utf8','hex')
  // cipherText += cipher.final('hex')
  const cipherText = Buffer.concat([cipher.update(JSON.stringify(data),'utf8'), cipher.final()])
  return cipherText.toString('hex')
}

// function _createDiffiHellmanResponse(arg1 : any, arg2 : any) {
//   return crypto.createDiffieHellman(arg1, arg2)
// }
