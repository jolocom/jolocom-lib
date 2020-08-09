import { IDidDocumentAttrs } from '../identity/didDocument/types'
import { DidDocument } from '../identity/didDocument/didDocument'
import { JWTEncodable, JSONWebToken } from '../interactionTokens/JSONWebToken'
import { normalizeSignedLdObject } from '../linkedData'
import { ErrorCodes } from '../errors'
import { Identity } from '../identity/identity'
import { sha256 } from '../utils/crypto'
import { verifySignature } from '../utils/validation'
import { ISignedCredentialAttrs } from '@jolocom/protocol-ts/dist/lib/signedCredential'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { parse } from './parse'

const parseAndValidateDidDoc = async (didDocument: IDidDocumentAttrs): Promise<DidDocument> => {
  const didDoc = DidDocument.fromJSON(didDocument)
  const signingKey = didDoc.findPublicKeySectionById(didDoc.signer.keyId)

  const signatureValid = verifySignature(
    //@ts-ignore optional proof
    await normalizeSignedLdObject(didDocument, didDocument['@context']),
    Buffer.from(didDoc.signature, 'hex'),
    {
      publicKeyHex: signingKey.publicKeyHex,
      controller: [signingKey.id],
      //@ts-ignore
      type: signingKey.type,
      id: 'TODO'
    }
  )

  if (signatureValid) {
    return didDoc
  }

  throw new Error(ErrorCodes.InvalidSignature)
}

const parseAndValidateSignedCredential = async (signedCredential: ISignedCredentialAttrs, signer: Identity): Promise<SignedCredential> => {
  const signedCred = SignedCredential.fromJSON(signedCredential)
  const signingKey = signer.didDocument.findPublicKeySectionById(signedCred.signer.keyId)

  const signatureValid = verifySignature(
    await normalizeSignedLdObject(signedCredential, signedCredential['@context']),
    Buffer.from(signedCred.signature, 'hex'),
    {
      publicKeyHex: signingKey.publicKeyHex,
      controller: [signingKey.id],
      //@ts-ignore
      type: signingKey.type,
      id: 'TODO'
    }
  )

  if (signatureValid) {
    signedCred
  }

  throw new Error(ErrorCodes.InvalidSignature)
}

export const parseAndValidateInteractionToken = async (jwt: string, identity: Identity) : Promise<JSONWebToken<JWTEncodable>> =>  {
  const interactionToken = parse.interactionToken.fromJWT<JWTEncodable>(jwt)

  const [body, payload, signature] = jwt.split('.')
  const signingKey = identity.didDocument.findPublicKeySectionById(interactionToken.signer.keyId)

  const isValid = await verifySignature(
    sha256(Buffer.from([body, payload].join('.'))),
    Buffer.from(interactionToken.signature, 'hex'), // TODO Use signature here, after making sure the encoding is base64
    {
      publicKeyHex: signingKey.publicKeyHex,
      controller: [signingKey.id],
      //@ts-ignore
      type: signingKey.type,
      id: 'TODO'
    }
  )

  if (isValid) {
    return interactionToken
  }

  throw new Error(ErrorCodes.InvalidSignature)
}

export const parseAndValidate = {
  interactionToken: parseAndValidateInteractionToken,
  didDocument: parseAndValidateDidDoc,
  signedCredential: parseAndValidateSignedCredential,
}
