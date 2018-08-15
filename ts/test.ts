import { JolocomLib, claimsMetadata } from '.'
import { registries } from './registries'
import { privateKeyToDID } from './utils/crypto'
import { ISignedCredentialAttrs } from './credentials/signedCredential/types';

const seed = Buffer.from('f4bd4d232595ec3a62b56836e8167a2b85431ee39b2c9e54af9cde38781bb026', 'hex')
const identityManager = JolocomLib.identityManager.create(seed)
const identityKey = identityManager.deriveChildKey(identityManager.getSchema().jolocomIdentityKey).privateKey

const registry = registries.jolocom.create()

// registry.create({
//   privateIdentityKey: identityKey,
//   privateEthereumKey: identityKey
// })

registry.authenticate(identityKey).then(async identityWallet => {
  const signedEmailCredential = await identityWallet.create.signedCredential({
    metadata: claimsMetadata.emailAddress,
    claim: { email: 'eugeniu@jolocom.com' }
  })

  const json = signedEmailCredential.toJSON() as ISignedCredentialAttrs
  const verifiableCrendetial = JolocomLib.parse.signedCredential.fromJSON(json)
  verifiableCrendetial.getExpiryDate()
  verifiableCrendetial.getIssuer()
  verifiableCrendetial.getProofSection()
  verifiableCrendetial.getSubject()
  verifiableCrendetial.validateSignature()
  
  console.log(await newCred.validateSignature())
})