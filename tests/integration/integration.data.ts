import { SoftwareKeyProvider } from '../../ts/vaultedKeyProvider/softwareProvider'
import { claimsMetadata } from 'cred-types-jolocom-core'

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
export const userVault = SoftwareKeyProvider.fromSeed(userSeed, userPass)

/* The private eth key derived from the user's seed */
export const userEthKey =
  '0x9c29b2cb941418d1f82f042b1cd67abbe2b9872a175de5aef5516b5440e9d6c5'

/* The seed for instantiating the service's vault */
const serviceSeed = Buffer.from(
  'f4a95507498d649fdc444fe5525978f24acd179dce79f2d0330372b2908d892b',
)
export const servicePass = 'service'
export const serviceVault = SoftwareKeyProvider.fromSeed(
  serviceSeed,
  servicePass,
)

/* The private eth key derived from the service's seed */
export const serviceEthKey =
  '0x7d550d944448771de554da01d3c8b0c6bef8cbdd339e836660847ba445d6f4b7'

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
