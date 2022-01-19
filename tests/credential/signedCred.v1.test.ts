import * as chai from 'chai'
import { SignedCredential } from '../../ts/credentials/v1.1/signedCredential'
import { CredentialBuilder } from '../../ts/credentials/v1.1/credentialBuilder'
import {
  example1,
  example3,
} from '../data/credential/signedCredential.data'
import { expect } from 'chai'
import { mockEmailCredCreationAttrs } from '../data/credential/credential.data'
import { LocalDidMethod } from '../../ts/didMethods/local'
import { EcdsaLinkedDataSignature, ChainedProof2021 } from '../../ts/linkedDataSignature'

chai.use(require("sinon-chai"))

describe.only('SignedCredential, version 1.1. data model compliance', () => {
  //@ts-ignore TODO #1 PROTOCOL TS CHANGES need to be published
  const cred: SignedCredential = SignedCredential.fromJSON(example1)

  it('@context MUST be present, one or more URIs', async () => {
    expect(cred.context.length).to.eq(2)
    expect(cred.context[0]).to.eq("https://www.w3.org/2018/credentials/v1")
  })

  it('"id" property MUST be present, must be a single URI', async () => {
    expect(cred.id).to.eq("http://example.edu/credentials/3732")
  })

  it('"type" property MUST be present, first entry must be "VerifiableCredential"', async () => {
    expect(cred.type.length).to.eq(2)
    expect(cred.type[0]).to.eq("VerifiableCredential")
  })

  it('"credentialSubject" property MUST be present, MAY be an object', async () => {
    expect(cred.credentialSubject).to.deep.eq(example1.credentialSubject)
  })

  it.skip('"credentialSubject" property MUST be present, MAY be a set of objects', async () => {
    //@ts-ignore TODO PROTOCOL TS CHANGES. Currently only one subject is allowed
    expect(SignedCredential.fromJSON(example3)).to.deep.eq(example3.credentialSubject)
  })

  it('"issuer" property MUST be present, MUST be a single URI', async () => {
    expect(cred.issuer).to.eq(example1.issuer)
  })

  it('"issuanceDate" property MUST be present, MUST be a single RFC3339 datetime', async () => {
    expect(cred.issued.toISOString()).to.eq(example1.issuanceDate)
  })

  it('"expirationDate" property MUST be present, MUST be a single RFC3339 datetime', async () => {
    expect(cred.expires.toISOString()).to.eq(example1.expirationDate)
  })
})

describe.only("VC Builder tests", () => {
  it('Creates a simple example', async () => {
    const {
      identityWallet,
    } = await new LocalDidMethod().recoverFromSeed(
      Buffer.from('000102030405060708090a0b0c0d0e0f', 'hex'), 'pass'
    )

    const builder = CredentialBuilder.fromClaimWithMetadata(mockEmailCredCreationAttrs)

    builder.setIssuer(identityWallet.publicKeyMetadata.signingKeyId)

    const {issued, expires} = getIssuanceExpiryDates()
    builder.setDates(issued, expires)

    await builder.generateProof(new EcdsaLinkedDataSignature(), identityWallet, 'pass')
    await builder.generateProof(new ChainedProof2021(), identityWallet, 'pass')

    console.log('final credential:')
    console.log(builder.toSignedCredential().toJSON())
  })

})

const getIssuanceExpiryDates = () => {
    const expires = new Date()
    expires.setFullYear(expires.getFullYear() + 5)

    const issued = new Date()


    return {issued, expires}
}