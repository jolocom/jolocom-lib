import { IIpfsConnector } from '../ipfs/types';
import { IEthereumConnector } from '../ethereum/types';
import { IdentityWallet } from '../identityWallet/identityWallet';
import { privateKeyToPublicKey, privateKeyToDID } from '../utils/crypto'
import { DidDocument } from '../identity/didDocument'
import { IDidDocumentAttrs } from '../identity/didDocument/types';

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

    const identityWallet = new IdentityWallet()
    identityWallet.setDidDocument({didDocument: ddo})

    await this.commit({wallet: identityWallet, privateEthereumKey})

    return identityWallet
  }

  public async commit(
    {wallet, privateEthereumKey}: {wallet: IdentityWallet, privateEthereumKey: Buffer}
  ): Promise<void> {
    const ddo = wallet.getDidDocument()
    let ipfsHash
    try {
      ipfsHash = await this.ipfsConnector.storeJSON({data: ddo, pin: true})
    } catch (error) {
      throw new Error(`Could not save DID record on IPFS. ${error.message}`)
    }
    return this.ethereumConnector.updateDIDRecord(
        {ethereumKey: privateEthereumKey, did: ddo.getDID(), newHash: ipfsHash}
      ).catch((error) => { throw new Error(`Could not register DID record on Ethereum. ${error.message}`) })
  }

  public async resolve({did}: {did: string}): Promise<IDidDocumentAttrs> {
    // TODO: return an instance of Identity (which is extended DDO)
    return this.ipfsConnector.catJSON({hash: await this.ethereumConnector.resolveDID({did})})
     .catch((error) => {
        throw new Error(`Could not retrieve DID Document. ${error.message}`)
      }) as Promise<IDidDocumentAttrs>
  }

  public async authenticate({privateIdentityKey}: {privateIdentityKey: Buffer}): IdentityWallet {
    const identityWallet = new IdentityWallet()
    const did = privateKeyToDID(privateIdentityKey)
    // TODO: change according to return of resolve
    const ddoAttrs = await this.resolve({did})
    const didDocument = DidDocument.fromJSON(ddoAttrs)
    identityWallet.setDidDocument({didDocument})
  }
}
