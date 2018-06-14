import { IIpfsConnector } from "../ipfs/types";
import { IEthereumConnector } from "../ethereum/types";

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
}
