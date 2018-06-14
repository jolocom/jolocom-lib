import { IIpfsConnector } from '../ipfs/types';
import { IEthereumConnector } from '../ethereum/types';
import { IdentityWallet } from '../identityWallet/identityWallet';
import { privateKeyToPublicKey } from '../utils/crypto'
import { DidDocument } from '../identity/didDocument'

/** Jolocom specific Registry, which uses IPFS
 *  and Ethereum for registering the indentity and the resolution
 *  mechanism.
 */
class Jolocom {
  private ipfsConnector: IIpfsConnector
  private ethereumConnector: IEthereumConnector

  public static create(
    {ipfsConnector, ethereumConnector}:
    {ipfsConnector: IIpfsConnector, ethereumConnector: IEthereumConnector}) {
    const jolocom = new Jolocom()
    jolocom.ipfsConnector = ipfsConnector
    jolocom.ethereumConnector = ethereumConnector

    return jolocom
  }

  public async create(
    {privateIdentityKey, privateEthereumKey}:
      { privateIdentityKey: Buffer, privateEthereumKey: Buffer }): Promise<IdentityWallet> {
    const ddo = new DidDocument().fromPublicKey(privateKeyToPublicKey(privateIdentityKey))
    // TODO: Initialize properly after the IdentityWallet is implemented
    const identityWallet = new IdentityWallet()
    this.commit({wallet: identityWallet, privateEthereumKey})

    return identityWallet
  }

  public async commit({wallet, privateEthereumKey}: {wallet: IdentityWallet, privateEthereumKey: Buffer}) {
    const ddo = wallet.getDidDocument()
    let ipfsHash = ''
    try {
      ipfsHash = await this.ipfsConnector.storeJSON({data: ddo, pin: true})
    } catch (error) {
      throw new Error(`Could not save DID record on IPFS. ${error.message}`)
    }
    try {
      await this.ethereumConnector.updateDIDRecord(
        {ethereumKey: privateEthereumKey, did: ddo.getDID(), newHash: ipfsHash}
      )
    } catch (error) {
      throw new Error(`Could not register DID record on Ethereum. ${error.message}`)
    }
  }

  // public async resolve({did}: {did: string}) {
  //   try {
  //     resolvedDid = this.ethereumConnector.resolveDID({did})
  //   } catch(error) {

  //   }
  // }
}
