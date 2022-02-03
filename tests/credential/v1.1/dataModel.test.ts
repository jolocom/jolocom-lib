import { SignedCredential } from '../../../ts/credentials/v1.1/signedCredential'
import {
  example1,
  example2,
  example3,
} from '../../data/credential/signedCredential.data'
import { expect } from 'chai'
import { dateToIsoString } from '../../../ts/credentials/v1.1/util'

describe.only('SignedCredential, version 1.1. data model compliance', () => {
  const cred: SignedCredential = SignedCredential.fromJSON(example1)

  it('@context MUST be present, one or more URIs', async () => {
    expect(cred.context.length).to.eq(2)
    expect(cred.context[0]).to.eq('https://www.w3.org/2018/credentials/v1')
  })

  it('"id" property MUST be present, must be a single URI', async () => {
    expect(cred.id).to.eq('http://example.edu/credentials/3732')
  })

  it('"type" property MUST be present, first entry must be "VerifiableCredential"', async () => {
    expect(cred.type.length).to.eq(2)
    expect(cred.type[0]).to.eq('VerifiableCredential')
  })

  it('"credentialSubject" property MUST be present, MAY be an object', async () => {
    expect(cred.credentialSubject).to.deep.eq(example1.credentialSubject)
  })

  it.skip('"credentialSubject" property MUST be present, MAY be a set of objects', async () => {
    expect(SignedCredential.fromJSON(example3)).to.deep.eq(
      example3.credentialSubject
    )
  })

  it('"issuer" property MUST be present, MUST be a single URI', async () => {
    expect(cred.issuer).to.eq(example1.issuer)
  })

  it('"issuanceDate" property MUST be present, MUST be a single RFC3339 datetime', async () => {
    expect(dateToIsoString(cred.issued)).to.eq(example1.issuanceDate)
  })

  it('"expirationDate" property MUST be present, MUST be a single RFC3339 datetime', async () => {
    expect(dateToIsoString(cred.expires)).to.eq(example1.expirationDate)
  })

  it('Should round-trip, example 1', () => {
    const serialized = SignedCredential.fromJSON(example1).toJSON()
    delete serialized['proof']
    const { proof, ...reference } = example1
    expect(serialized).to.deep.eq(reference)
  })

  it('Should round-trip, example 2', () => {
    const serialized = SignedCredential.fromJSON(example2).toJSON()
    delete serialized['proof']

    const { proof, ...reference } = example2
    expect(serialized).to.deep.eq(reference)
  })

  it('Should round-trip, example 3', () => {
    const serialized = SignedCredential.fromJSON(example3).toJSON()
    delete serialized['proof']

    const { proof, ...reference } = example3
    expect(serialized).to.deep.eq(reference)
  })
})
