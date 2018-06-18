import { expect } from 'chai'
import { CredentialRequest, constraintFunctions } from '../ts/credentialRequest/credentialRequest'

describe('CredentialRequest', () => {
  it('Should implement static create method', () => {
    const cr = CredentialRequest.create({
      callbackURL: 'http://test.com',
      requestedCredentials: [{
        type: ['Credential', 'ProofOfNameCredential'],
        constraints: []
      }]
    })

    expect(cr.getCallbackURL()).to.equal('http://test.com')
    expect(cr.getRequestedCredentialTypes()).to.deep.equal([['Credential', 'ProofOfNameCredential']])
  })

  it('Should implement an applyConstraints method', () => {
    const cr = CredentialRequest.create({
      callbackURL: 'http://test.com',
      requestedCredentials: [{
        type: ['Credential', 'ProofOfNameCredential'],
        constraints: [constraintFunctions.is('issuer', 'did:jolo:issuer')]
      }]
    })

    const firstMockCredential = {
      '@context': [],
      'id': '',
      'issuer': 'did:jolo:issuer',
      'claim': { id: '' },
      'issued': '',
      'type': ['Credential', 'ProofOfNameCredential'],
      'proof': {
        created: new Date(),
        creator: '',
        nonce: '',
        signatureValue: '',
        type: ''
      }
    }
    const secondMockCredential = Object.assign({}, firstMockCredential, {issuer: 'did:jolo:different'})
    const filtered = cr.applyConstraints([firstMockCredential, secondMockCredential])
    expect(filtered).to.deep.equal([firstMockCredential])
  })

  it('Should implement toJSON method', () => {
    const cr = CredentialRequest.create({
      callbackURL: 'http://test.com',
      requestedCredentials: [{
        type: ['Credential', 'ProofOfNameCredential'],
        constraints: [constraintFunctions.is('issuer', 'did:jolo:issuer')]
      }]
    })

    expect(cr.toJSON()).to.deep.equal({
      callbackURL: 'http://test.com',
      requestedCredentials: [{
        constraints: {
          and: [
            { '==': [ true, true ] },
            { '==': [ { var: 'issuer' }, 'did:jolo:issuer' ] }
          ]
        },
        type: [
          'Credential',
          'ProofOfNameCredential'
        ]
      }]
    })
  })

  it('Should implement all getter methods', () => {
    const json = {
      requestedCredentials: [{
        type: ['Credential', 'ProofOfNameCredential'],
        constraints: {
          and: [ {' === ': [true, true]} ]
        }
      }],
      callbackURL: 'http: // test.com',
    }

    const credentialRequest = CredentialRequest.fromJSON(json)
    expect(credentialRequest.getCallbackURL()).to.equal(json.callbackURL)
    expect(credentialRequest.getRequestedCredentialTypes().length).to.equal(1)
    expect(credentialRequest.getRequestedCredentialTypes()[0]).to.deep.equal(json.requestedCredentials[0].type)
  })

  it('Should implement all setter methods', () => {
    const credentialRequest = new CredentialRequest()
    const mockCallbackURL = 'https://service.com/auth'

    // tslint:disable-next-line:no-unused-expression
    expect(credentialRequest.getCallbackURL()).to.be.undefined
    credentialRequest.setCallbackURL(mockCallbackURL)
    expect(credentialRequest.getCallbackURL()).to.equal(mockCallbackURL)
  })

  it('Should implement static fromJSON method', () => {
    const json = {
      requestedCredentials: [{
        type: ['Credential', 'ProofOfNameCredential'],
        constraints: {
          and: [ {' === ': [true, true]} ]
        }
      }],
      callbackURL: 'http: // test.com'
    }

    const credentialRequest = CredentialRequest.fromJSON(json)
    expect(credentialRequest.toJSON()).to.deep.equal(json)
  })
})
