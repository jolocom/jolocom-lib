import { IDidDocumentAttrs } from '../identity/didDocument/types'
import { DidDocument } from '../identity/didDocument/didDocument'
import { JWTEncodable, JSONWebToken } from '../interactionTokens/JSONWebToken'
import { validateJsonLd } from '../linkedData'
import { ErrorCodes } from '../errors'
import { Identity } from '../identity/identity'
import { sha256 } from '../utils/crypto'
import { verifySignatureWithIdentity } from '../utils/validation'
import { ISignedCredentialAttrs } from '@jolocom/protocol-ts/dist/lib/signedCredential'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { parse } from './parse'

const parseAndValidateDidDoc = async (didDocument: IDidDocumentAttrs): Promise<DidDocument> => {
  const didDoc = DidDocument.fromJSON(didDocument)

  const signatureValid = await validateJsonLd(
    //@ts-ignore optional proof
    didDocument,
    Identity.fromDidDocument({ didDocument: didDoc })
  )

  if (signatureValid) {
    return didDoc
  }

  throw new Error(ErrorCodes.InvalidSignature)
}

const parseAndValidateSignedCredential = async (signedCredential: ISignedCredentialAttrs, signer: Identity): Promise<SignedCredential> => {
  const signedCred = SignedCredential.fromJSON(signedCredential)

  const signatureValid = await validateJsonLd(
    signedCredential,
    signer
  )

  if (signatureValid) {
    return signedCred
  }

  throw new Error(ErrorCodes.InvalidSignature)
}

export const parseAndValidateInteractionToken = async (jwt: string, signer: Identity) : Promise<JSONWebToken<JWTEncodable>> =>  {
  const interactionToken = parse.interactionToken.fromJWT<JWTEncodable>(jwt)

  const [body, payload, signature] = jwt.split('.')

  const isValid = await verifySignatureWithIdentity(
    Buffer.from(Buffer.from([body, payload].join('.'))),
    Buffer.from(signature, 'hex'),
    interactionToken.signer.keyId,
    signer
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
