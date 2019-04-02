import { SoftwareKeyProvider } from '../../ts/vaultedKeyProvider/softwareProvider'
import { claimsMetadata } from 'cred-types-jolocom-core'
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
const userSeed = Buffer.from(
  '901271e3f39bc97987193bfaf986a1590191d83f12d136d3039f6d5a5d837201',
)
export const userPass = 'user'
export const userVault = new SoftwareKeyProvider(userSeed, userPass)

/* The private eth key derived from the user's seed */
export const userEthKey =
  '0x211ac58274315777e2bbcfd185b955147086fd61e1e1a40839dc413a953f0f60'

/* The seed for instantiating the service's vault */
const serviceSeed = Buffer.from(
  'f4a95507498d649fdc444fe5525978f24acd179dce79f2d0330372b2908d892b',
)
export const servicePass = 'service'
export const serviceVault = new SoftwareKeyProvider(serviceSeed, servicePass)

/* The private eth key derived from the service's seed */
export const serviceEthKey =
  '0x3b781643bbfdf3964b2c6be0ac1ddf48e874975a88dadc69a719ed3b6bf4f51f'

/* Creation attributes for interaction flows */

export const integrationCredRequestJSON = {
  callbackURL: 'http://test.com',
  credentialRequirements: [
    {
      type: ['Credential', 'ProofOfEmailCredential'],
      constraints: [
        {
          '==': [
            { var: 'issuer' },
            'did:jolo:bf8095f75ec116362eb31d5e68736be6688f82db616d1dd7df5e9f99047347b2',
          ],
        },
      ],
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
