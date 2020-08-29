import * as sinon from 'sinon'
import { mockDid } from '../../data/didDocument.data'
import {
  publicProfileCredJSON,
  emailCredential,
} from '../../data/identity.data'
import { encryptionPass } from './jolocomRegistry.data'
import { mockPubProfServiceEndpointJSON } from '../../data/didDocumentSections.data'
import { expect } from 'chai'
import { JolocomRegistrar } from '../../../ts/didMethods/jolo/registrar'
import { SignedCredential } from '../../../ts/credentials/signedCredential/signedCredential'
import { KeyTypes, SoftwareKeyProvider } from '@jolocom/vaulted-key-provider'
import { recoverJoloKeyProviderFromSeed } from '../../../ts/didMethods/jolo/recovery'
import { walletUtils } from '@jolocom/native-core'

describe('Jolocom Registry - create', () => {
  it('should correctly call update, and return a new identity wallet given a new vkp', async () => {
    const password = 'secret'
    const initialId = 'initial'
    const mockVault = await SoftwareKeyProvider.newEmptyWallet(
      walletUtils,
      initialId,
      password,
    )
    const testRegistrar = new JolocomRegistrar()
    //@ts-ignore private property
    testRegistrar.update = sinon.stub().resolves()

    const identityWallet = await testRegistrar.create(mockVault, encryptionPass)

    expect(mockVault.id).not.eq(initialId)
    expect(await mockVault.getPubKeys(password)).lengthOf(3)
    expect(identityWallet.didDocument.publicKey.length).to.eq(2)
    expect(identityWallet.didDocument.publicKey[0].publicKeyHex).lengthOf(66)
    expect(identityWallet.didDocument.publicKey[0].type).to.eq(
      KeyTypes.ecdsaSecp256k1VerificationKey2019,
    )

    expect(identityWallet.didDocument.publicKey[1].publicKeyHex).lengthOf(64)
    expect(identityWallet.didDocument.publicKey[1].type).to.eq(
      KeyTypes.x25519KeyAgreementKey2019,
    )

    sinon.assert.calledWith(
      //@ts-ignore private property
      testRegistrar.update,
      identityWallet.didDocument,
      mockVault,
      password,
    )
  })

  it('should correctly throw if the vkp contains a jolo id, but no suitable keys', async () => {
    const password = 'secret'
    const initialId = 'did:jolo:aaa'
    const mockVault = await SoftwareKeyProvider.newEmptyWallet(
      walletUtils,
      initialId,
      password,
    )
    const testRegistrar = new JolocomRegistrar()
    //@ts-ignore private property
    testRegistrar.update = sinon.stub().resolves()

    expect(
      await testRegistrar
        .create(mockVault, encryptionPass)
        .catch(e => e.message),
    ).to.eq('Jolo registrar - No signing key with ref keys-1 found')
  })

  it('should correctly call update, and return a new identity wallet given a populated vkp', async () => {
    const password = 'secret'
    const mockVault = await recoverJoloKeyProviderFromSeed(
      Buffer.from('a'.repeat(64), 'hex'),
      password,
      walletUtils,
    )
    const testRegistrar = new JolocomRegistrar()
    //@ts-ignore private property
    testRegistrar.update = sinon.stub().resolves()

    const identityWallet = await testRegistrar.create(mockVault, encryptionPass)

    expect(identityWallet.did).to.eq(mockDid)
    expect(identityWallet.didDocument.publicKey.length).to.eq(2)
    expect(identityWallet.didDocument.publicKey[0].publicKeyHex).lengthOf(66)
    expect(identityWallet.didDocument.publicKey[0].type).to.eq(
      KeyTypes.ecdsaSecp256k1VerificationKey2019,
    )

    expect(identityWallet.didDocument.publicKey[1].publicKeyHex).lengthOf(64)
    expect(identityWallet.didDocument.publicKey[1].type).to.eq(
      KeyTypes.x25519KeyAgreementKey2019,
    )

    sinon.assert.calledWith(
      //@ts-ignore private property
      testRegistrar.update,
      identityWallet.didDocument,
      mockVault,
      password,
    )
  })

  it('should correctly update a public profile', async () => {
    const password = 'secret'
    const mockVault = await recoverJoloKeyProviderFromSeed(
      Buffer.from('a'.repeat(64), 'hex'),
      password,
      walletUtils,
    )
    const testRegistrar = new JolocomRegistrar()

    // Using the email credential because it has a valid signature.
    const mockPublicProfile = SignedCredential.fromJSON(emailCredential)

    //@ts-ignore private property
    testRegistrar.update = sinon.stub().resolves()

    const identity = await testRegistrar.create(mockVault, encryptionPass)

    testRegistrar.registrarFns.publishPublicProfile = sinon
      .stub()
      .resolves(mockPubProfServiceEndpointJSON)

    await testRegistrar.updatePublicProfile(
      mockVault,
      encryptionPass,
      identity,
      mockPublicProfile,
    )

    expect(identity.didDocument.service[0].toJSON()).to.deep.eq(
      mockPubProfServiceEndpointJSON,
    )

    sinon.assert.calledWith(
      //@ts-ignore
      testRegistrar.registrarFns.publishPublicProfile,
      identity.did,
      mockPublicProfile,
    )

    // Signed by a different DID
    const newPublicProfile = SignedCredential.fromJSON(publicProfileCredJSON)

    expect(
      await testRegistrar
        .updatePublicProfile(
          mockVault,
          encryptionPass,
          identity,
          newPublicProfile,
        )
        .catch(_ => false),
    ).to.eq(false)
  })
})
