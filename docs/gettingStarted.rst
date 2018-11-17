Getting Started
===============

How to install the Jolocom library
###################################

The first step to start using the Jolocom protocol is to make sure to install the Jolocom library as a dependency in your project. You can use ``npm`` or ``yarn`` to do so:

.. code-block:: bash

  # using npm
  npm install jolocom-lib --save

  # using yarn
  yarn add jolocom-lib

.. warning:: Please be aware that the Jolocom library is still in early stages, we are currently anchoring all identities on the Rinkeby testnet.

  Please do not transfer any real ether to your Jolocom identity.


How to create a Self-Sovereign Identity
#########################################

In broad strokes, the creation of a self-sovereign identity comprises the following steps:

* Instantiate the ``SoftwareKeyProvider`` class providing a 32 byte random seed ``Buffer``, and a password for encryption
* Use the ``keyProvider`` to derive two keys, one to control your Jolocom identity, and one to sign Ethereum transactions
* Transfer a small amount of Ether to your second key to later pay for updating the registry contract
* Instantiate and use a ``JolocomRegistry`` to anchor the newly created did document on the Ethereum network

In the following sections, we will describe the individual steps in greater detail.

**Instantiate the Key Provider class**

The ``SoftwareKeyProvider`` class abstracts all functionality related to `deriving key pairs <https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki>`_. and creating / validating cryptographic signatures.
The 32 byte seed used to instantiate the key provider is persisted in the instance, encrypted using the provided password. Therefore, for all opperations involving deriving keys, the password needs to be provided as well.
This is what instantiating a key provider looks like:

.. code-block:: typescript

  import { JolocomLib } from 'jolocom-lib'
  import { crypto } from 'crypto'

  // Feel free to use a better rng module
  const seed = crypto.randomBytes(32)
  const password = 'correct horse battery staple'

  const vaultedKeyProvider = new JolocomLib.SoftwareKeyProvider(seed, password)

.. note:: In the next release, the constructor will be modified to only require the encrypted seed value, to reduce the amount of time the seed is exposed.

**Derive a key to sign the Ethereum transaction**

The ``vaultedKeyProvider`` we have just instantiated can now be used to derive further key pairs needed to complete the registration.
We need to derive a key for signing the Ethereum transaction anchoring the newly created identity.

.. code-block:: typescript

  const publicEthKey = vaultedKeyProvider.getPublicKey({
    encryptionPass: secret
    derivationPath: JolocomLib.KeyTypes.ethereumKey // "m/44'/60'/0'/0/0"
  })

.. seealso:: If any of your derived keys become compromised, you only lose one key. All other derived keys (including the most 
  important master key) remain secure. Go to `BIP-32 <https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki>`_ 
  if you want to find out more about this derivation scheme. 
  We are currently looking at key recovery solutions in case the master key itself is compromised.

The only arguments we need to pass to ``getPublicKey`` is the ``derivationPath``, in the format defined in `BIP-32 <https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki>`_, and the ``encryptionPass`` that was used to create the encryption cipher.
The Jolocom library ships with a few predefined paths for generating specific key pairs. The list will expand as new use cases are explored.  You can view the available paths as follows:

.. code-block:: typescript

  console.log(JolocomLib.KeyTypes)

In the next steps, we will transfer a small amount of Ether to the Rinkeby address corresponding to the created key pair.

**Transferring Ether to the key**

In order to anchor the identity on the Ethereum network, a transaction needs to be assembled and broadcasted. In order to pay for the execution, a small amount of Ether needs to
be present on the signing key. There are a few ways to receive Ether on the Rinkeby test network, we also expose a helper function to aid this:

.. code-block:: typescript

  await JolocomLib.util.fuelKeyWithEther(publicEthKey)

This will send a request to a `fueling service <https://faucet.jolocom.com/balance>`_ Jolocom is currently hosting.

**Anchoring the identity**

The only thing left is actually anchoring the identity on Ethereum and storing the newly created did document on IPFS.
For these purposes, the ``JolocomRegistry`` can be used. It is essentially an implementation of a `did resolver <https://w3c-ccg.github.io/did-spec/#did-resolvers>`_.
The creation would look as follows:

.. code-block:: typescript

  import { JolocomLib } from 'jolocom-lib'

  const registry = Jolocom.registries.jolocom.create()

  await registry.create(vaultedKeyProvider, secret)

IIBehind the scenes, two key pairs are derived from the seed. The first key is used to derive the ``did`` and create a corresponding ``did`` document.
The second key is used to sign the Ethereum transaction adding the new ``did`` to the registry smart contract.

.. note:: We intend to add support for `executable signed messages <https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1077.md>`_ in the next major release, therefore removing the need to derive two key pairs.

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
#########################################

Up to this point, you have successfully created and anchored a digital self-sovereign identity. In the next sections we will look at how you can:

* create a public profile and make it available through your ``did`` document.
* issue statements about yourself and others in form of signed `verifiable credentials <https://w3c.github.io/vc-data-model/>`_.
* authenticate against other identities, share and receive signed verifiable credentials, and create various interaction tokens.

All of these are explored in the later sections.
