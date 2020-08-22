import { claimsMetadata } from '@jolocom/protocol-ts'
import { walletUtils } from '@jolocom/native-core-node-linux-x64'
import { SoftwareKeyProvider } from '@jolocom/vaulted-key-provider'

/* Local configuration for ganache server. the contract address is deterministic */
export const testEthereumConfig = {
  providerUrl: 'http://localhost:8945',
  contractAddress: '0xF2aB668ABA031cF5Cb5567933e910A59072B1965',
}

/* Local configuration for the ipfs daemon */

export const testIpfsConfig = {
  protocol: 'http',
  port: 5001,
  host: '127.0.0.1',
}

/* Random addr for the independent deployeer of the contract */
export const deployerEthKey =
  '0x18e12d1ddf1275201ab20f50dbcc2b7cd6ff21653cc6ac0acd01414862d265c7'

/* The seed for instantiating the user's vault */
export const userSeed = Buffer.from(
  '901271e3f39bc97987193bfaf986a1590191d83f12d136d3039f6d5a5d837201',
  'hex',
)

export const userPass = 'a'.repeat(32)
export const getNewVault = (id: string, pass: string)  => SoftwareKeyProvider.newEmptyWallet(walletUtils, id, pass)

/* The private eth key derived from the user's seed */
export const userEthKey =
  '0x58b03b7b5a44f763fa3387dd68dc9552b31ebff0086fd9d85a202f960e46f315'

/* The seed for instantiating the service's vault */
const serviceSeed = Buffer.from(
  'f4a95507498d649fdc444fe5525978f24acd179dce79f2d0330372b2908d892b',
  'hex',
)
export const servicePass = 's'.repeat(32)

/* The private eth key derived from the service's seed */
export const serviceEthKey =
  '0x0290c9f6e4f73dd5718674493b69956f3d65969acaf7205478c20ae4086f5df2'

/* Creation attributes for interaction flows */

export const integrationCredRequestJSON = {
  callbackURL: 'http://test.com',
  credentialRequirements: [
    {
      type: ['Credential', 'ProofOfEmailCredential'],
      constraints: [],
    },
  ],
}

export const emailCredJSON = {
  metadata: claimsMetadata.emailAddress,
  subject:
    'did:jolo:bf8095f75ec116362eb31d5e68736be6688f82db616d1dd7df5e9f99047347b2',
  claim: {
    email: 'user@test.com',
  },
}
