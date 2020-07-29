import * as sinon from 'sinon'
import { didDocumentJSON, mockKeyId } from '../data/didDocument.data'
import { publicProfileCredJSON } from '../data/identity.data'
import { SoftwareKeyProvider } from '../../ts/vaultedKeyProvider/softwareProvider'
import { testSeed } from '../data/keys.data'
import { encryptionPass } from './jolocomRegistry.data'
import { mockPubProfServiceEndpointJSON } from '../data/didDocumentSections.data'
import { expect } from 'chai'
import { JolocomRegistrar } from '../../ts/didMethods/jolo/registrar'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'

describe('Jolocom Registry - create', () => {
  const sandbox = sinon.createSandbox()
  let clock

  const mockVault = SoftwareKeyProvider.fromSeed(testSeed, encryptionPass)

  before(async () => {
    // For deterministic nonces on proofs
    sandbox
      .stub(SoftwareKeyProvider, 'getRandom')
      .returns(Buffer.from('1842fb5f567dd532', 'hex'))
    // For deterministic values in 'Created' / 'Updated'
    clock = sinon.useFakeTimers()
  })

  after(() => {
    sandbox.restore()
    clock.restore()
  })

  it('should correctly call update, and return a new identity wallet', async () => {
    const testRegistrar = new JolocomRegistrar()
    //@ts-ignore private property
    testRegistrar.update = sinon.stub().resolves()

    const identityWallet = await testRegistrar.create(mockVault, encryptionPass)

    // TODO A bit messy
    expect(identityWallet.didDocument.toJSON()).to.deep.eq({
      ...didDocumentJSON,
      service: [],
      authentication: [mockKeyId],
      proof: {
        ...didDocumentJSON.proof,
        signatureValue:
          '8146642cca944d90360447382b0d443b1eb23a9a3b88d5587eac2649d01c449d5322ba07666a1c3dfbfb6301f83ff4a8e0da44bab2cd2a69efce7bbbd41c72b2',
      },
    })

    //@ts-ignore
    sinon.assert.calledOnce(testRegistrar.update)
  })

  it('should correctly update a public profile', async () => {
    const testRegistrar = new JolocomRegistrar()

    //@ts-ignore private property
    testRegistrar.update = sinon.stub().resolves()

    const identity = await testRegistrar.create(mockVault, encryptionPass)

    testRegistrar.registry.publishPublicProfile = sinon
      .stub()
      .resolves(mockPubProfServiceEndpointJSON)

    await testRegistrar.updatePublicProfile(
      mockVault,
      encryptionPass,
      identity,
      SignedCredential.fromJSON(publicProfileCredJSON),
    )

    expect(identity.didDocument.service[0].toJSON()).to.deep.eq(
      mockPubProfServiceEndpointJSON,
    )
    sinon.assert.calledWith(
      testRegistrar.registry.publishPublicProfile,
      identity.did,
      publicProfileCredJSON,
    )
  })
})
