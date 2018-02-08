import * as crypto from 'crypto'

/*@summay - implementation of the Diffie-Hellman secret exchange process; initiateSecretExchange starts the process
  @returns {dhSet} - prime (which is shared with the communitation party),
  initiator (objectused for getEncryptionSecret), and initiatorKey (public key shared with communicator party)
 */
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

/*@summay - respond to the diffi hellman secret exchange
  @params - prime (hex string)
  @returns {dhSet} - responder (object used for getEncryptionSecret),
  and responderKey (public key shared with communicator party)
 */
export function respondSecretExchange({prime} : {prime: string}) {
  const responder = crypto.createDiffieHellman(prime, 'hex')
  const responderKey = responder.generateKeys('hex')

  const dhSet = {
    responder: responder,
    responderKey: responderKey
  }
  return dhSet
}

/*@summay - derives secret from input params
  @params - party: object initiator or responder; pubKey: others' party public Key
  @returns Buffer - this is the secret
 */
export function getEncryptionSecret({party, pubKey} : {party: any, pubKey: string}) {
  return party.computeSecret(pubKey, 'hex')
}

/*@summay - encrypts information
  @params - key: secret Buffer; plainText: information to be encrypted
  @returns hex string - cipherText
 */
export function encrypt({key, plainText} : {key: any, plainText: any}) : string {
  const cipher = crypto.createCipher('aes-128-ctr', key)
  let cipherText = cipher.update(JSON.stringify(plainText),'utf8','hex')
  cipherText += cipher.final('hex')

  return cipherText
}

/*@summay - decrypts information
  @params - key: secret Buffer; cihperText: information to be decrypted
  @returns {plainText} - decrypted information
 */
export function decrypt({key, cipherText} : {key: any, cipherText: string}) {
  var decipher = crypto.createDecipher('aes-128-ctr', key)
  var plainText = decipher.update(cipherText,'hex','utf8')
  plainText += decipher.final('utf8')

  return JSON.parse(plainText)
}
