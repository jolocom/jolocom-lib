===============
Getting Started
===============
The first step to start using the Jolocom protocol is to make sure to install the Jolocom library as a dependency in your project. You can use ``npm`` or ``yarn`` to do so:

.. code-block:: terminal

  # using npm
  npm install jolocom-lib --save

  # using yarn
  yarn add jolocom-lib

.. warning:: Please be aware that the Jolocom library is still in early stages, we are currently anchoring all identities on the Rinkeby testnet.

  Please do not transfer any real ether to your Jolocom identity.


How to create a Self-Sovereign Identity
=======================================

On a higher level, the creation of a self-sovereign identity comprises the following steps:

* Instantiate the Identity Manager class passing a ``Buffer`` containing 32 bytes of entropy
* Derive 2 key pairs, later used to manage your identity and to finish the registration
* Create the DID document and anchor it on Ethereum and IPFS

We will now look at each step in more detail.

**Instantiate the Identity Manager class**

The Identity Manager class contains methods enabling the derivation of new key pairs from one master key, as defined in `BIP-32 <https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki>`_.

The master key itself is never used for anything outside of derivation, all further interactions with services and other identities are based on derived keys.

As briefly mentioned before, in order to instantiate the Identity Manager a 32 byte ``seed`` value is required:

.. code-block:: typescript

  import { JolocomLib } from 'jolocom-lib'
  import { crypto } from 'crypto'

  // Feel free to use a better rng module
  const seed = crypto.randomBytes(32)
  const identityManager = JolocomLib.identityManager.create(seed)

**Derive Child Key pairs**

The ``identityManager`` instance we have created can now be used to derive further key pairs needed to complete the registration.
Firstly, we need to derive the key pair that will be used to control your Jolocom Identity.

.. code-block:: typescript
  const identityKeyDerivationPath = identityManager.getSchema().jolocomIdentityKey // Derivation path - 'm/73'/0'/0'/0'
  const identityKey = identityManager.deriveChildKey(path)

.. seealso:: If any of your derived keys is compromised, you only lose one key. All other derived keys (including the most 
  important master key) remain secure. Go to `BIP-32 <https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki>`_ 
  if you want to find out more about this derivation scheme. 
  We are currently looking at key recovery solutions in case the master key itself is compromised.

The only argument we need to pass to ``identityManager.deriveChildKey`` is the derivation ``path``, as defined in `BIP-32 <https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki>`_.
The Jolocom library ships with a number of predefined paths for generating specific key pairs, which can be accessed as follows:

.. code-block:: typescript

  // identityManager.getScehma() returns all paths shipped with the library
  //  {
  //    jolocomIdentityKey: "m73'/0'/0'/0'",
  //    ethereumKey: "m/44'/60'/0'/0/0'"
  //  }

  const schema = identityManager.getSchema()

  const identityKey = identityManager.deriveChildKey(schema.jolocomIdentityKey)
  const ethereumKey = identityManager.deriveChildKey(schema.ethereumKey)

The return value of the ``deriveChildKey`` function looks as follows:

.. code-block:: typescript 

	{ 
  		wif: string,
  		privateKey: Buffer,
  		publicKey: Buffer,
  		keyType: string,
  		path: string
	}

By this point, we have generated two key pairs, one for acting on behalf of the Jolocom Identity, and one for paying for the Ethereum transaction needed to complete the registration.
The next step shows how to anchor your new identity on Ethereum, by adding a record to the Joloocm registry contract.

**Anchor the Identity**

In order to create or resolve Jolocom identities, a new registry instance must be created.
The registry can help retrieve, create, and modify identity related data persisted on IPFS and indexed on Ethereum.

.. code-block:: typescript

  import { JolocomLib } from 'jolocom-lib'

  const registry = Jolocom.registry.jolocom.create()

Once the registry has been created, you can proceed with anchoring the identity.

.. code-block:: typescript

  // We use the 2 private keys we derived in the previous step
  const identityWallet = await registry.create({
    privateIdentityKey: identityKey.privateKey,
    privateEthereumKey: ethereumKey.privateKey
  })

.. warning:: You might observe, 2 private keys are needed to create an identity. The first key, ``privateIdentityKey`` is the one that will be used to control your Jolocom identity.
  The second key, ``privateEthereumKey`` is only used to broadcast the identity creation transaction to the Ethereum network. Due to this, the ``privateEthereumKey``
  should have enough Rinkeby ether associated with it to pay for the identity creation.
  In the close future, the ``privateEthereumKey`` will be deprecated in favour of executable signed messages as defined in `EIP-1077 <https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1077.md>`_.

.. seealso:: In case you are looking for a easy way to receive some Rinkeby Ether for testing purposes, all you need to do is send a ``POST`` request with your Ethereum address to the `corresponding endpoint <https://faucet.jolocom.com/request/>`_.
  Reference implementation can also be found `here <https://github.com/jolocom/smartwallet-app/blob/develop/src/lib/ethereum.ts#L21>`_.

**Use custom connectors for Ethereum and IPFS communication**

When it comes down to updating or resolving data persisted on IPFS and Ethereum, the Jolocom Library delegates to two internal components,
an `IPFS connector <https://github.com/jolocom/jolocom-lib/blob/master/ts/ipfs/types.ts#L7>`_ for interacting with an IPFS node,
and an `Ethereum connector <https://github.com/jolocom/jolocom-lib/blob/master/ts/ethereum/types.ts#L12>`_, for interacting with the deployed registry smart contract.

You can also supply your custom implementations of both connectors, in case your identities are indexed on a private Ethereum deployment, or you would like to connect to a custom IPFS cluster. A custom implementation might look as follows:

.. code-block:: typescript

  import { JolocomLib } from 'jolocom-lib'
  import { IIpfsConnector } from './ipfs/types'
  import { jolocomEthereumResolver } from './ethereum'

  // Our custom implementation needs to correctly implement a library defined interface to be considered valid
  class CustomIpfsConnector implements IIpfsConnector {
    constructor(gatewayUrl : string) {
      this.httpGatewayUrl = gatewayUrl
    }

    public storeJSON = async ({ data, pin }: { data: object; pin: boolean; }) => {
      // Perhaps authenticate against an endpoint first
      const fileHash = await customIpfsAddImplementation(data, pin)
      return fileHash
    }

    public catJSON = async (hash: string) => {
      // Perhaps check in a local cache database first.
    }

    public removePinnedHash = async (hash: string) => { ... }

    createDagObject = ({ data, pin }: { data: object; pin: boolean; }) => { ... }

    public resolveIpldPath = async (pathToResolve: string) => { ... }
  }

  const customRegistry = JolocomLib.registry.jolocom.create({
    ipfsConnector: new CustomIpfsConnector(),
    ethereumConnector: jolocomEthereumResolver
  })


In this case, we defined a custom class that will handle all communication with IPFS and configured the registry to use it. It might be worth pointing out that we still use the default Ethereum connector. If we wanted to use a custom Ethereum connector, same logic could be followed.

The returned ``identityWallet`` class allows for creating digital signatures, authenticating against services, and creating verifiable credentials. We'll explore some of this functionality in later sections.

What can I do now?
==================

Up to this point, you have successfully created and anchored a self-sovereign identity. Now you can use 
this identity to:

* create a public profile and publish it through your DID document
* make statements about yourself, and others in the form of verifiable credentials
* authenticate against services, and share the aforementioned credentials with other identities.


Please visit our usage section to find out more about possible usage patterns with the Jolocom Protocol.