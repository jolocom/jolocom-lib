Getting Started
===============

.. warning::

  Please be aware that the Jolocom library is still undergoing active development. All identities are currently anchored on the Rinkeby testnet.
  Please do not transfer any real ether to your Jolocom identity.

How to install the Jolocom library
###################################

To begin using the Jolocom library, first add it as a dependency in your project. You can use ``npm`` or ``yarn`` to do so:

.. code-block:: bash

  # using npm
  npm install jolocom-lib --save

  # using yarn
  yarn add jolocom-lib

Browser and React Native Environments
#####################################

To use the library in a browser or react native environment, you also need some polyfills as some of the dependencies assume running in a node environment

.. code-block:: bash

  # using npm
  npm install --save vm-browserify crypto-browserify assert stream-browserify events

  # using yarn
  yarn add vm-browserify crypto-browserify assert stream-browserify events


Also, you will need to configure your bundler (webpack, parcel, metro, etc) with aliases for the modules named \*-browserify

For React Native's metro.config.js:

.. code-block:: javascript

  module.exports = {
    resolver: {
      extraNodeModules: {
        // Polyfills for node libraries
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "vm": require.resolve("vm-browserify")
      }
    },
  }


Also :code:`process.version` must be defined, so you might need to just set it in your index file:

.. code-block:: javascript

  process.version = 'v11.13.0'

How to create a self-sovereign identity
#########################################

In broad strokes, the creation of a self-sovereign identity comprises the following steps:

* Instantiate a ``SoftwareKeyProvider``
* Use the instantiated ``keyProvider`` to derive two keys, one to control your Jolocom identity, and another one to sign Ethereum transactions (e.g. for anchoring the identity, rotating keys, etc.)
* Fuel the second derived key with enough Ether to pay for the transaction anchoring the identity
* Instantiate and use the ``JolocomRegistry`` to create and anchor the DID document on the Ethereum network

The following sections elaborate on these steps.

**Instantiate the Key Provider class**

The ``SoftwareKeyProvider`` class abstracts all functionality related to `deriving key pairs <https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki>`_ and creating / validating cryptographic signatures.
Currently two ways of instantiating the class are supported, namely using the constructor or using the static ``fromSeed`` method:

.. code-block:: typescript

  import { JolocomLib } from 'jolocom-lib'
  import { crypto } from 'crypto'

  // Feel free to use a better rng module
  const seed = crypto.randomBytes(32)
  const password = 'secret'

  const vaultedKeyProvider = JolocomLib.KeyProvider.fromSeed(seed, password)

In the snippet above the ``fromSeed`` method is used. It takes the seed in cleartext, and a password that will be used as a key to encrypt the provided seed on the instance.

.. note:: The password must be 32 bytes long **(the expected encoding is UTF-8)**. In case a password of a different length is provided (e.g. the example above), it will be hashed using ``sha256`` internally before usage. An appropriate warning will be printed to the console.

The encrypted seed can be retrieved from the class instance using:

.. code-block:: typescript

  const encryptedSeed = vaultedKeyProvider.encryptedSeed

.. note:: The returned value is a 64 byte ``Buffer``, containing the initialization vector (IV) (16 bytes) concatenated with the ciphertext (48 bytes). ``aes-256-cbc`` is used for encryption.

The alternative way to instantiate the class by using it's constructor:

.. code-block:: typescript

  import { JolocomLib } from 'jolocom-lib'

  const vaultedKeyProvider = new JolocomLib.KeyProvider(encryptedSeed)

.. note:: The expected value for ``encryptedSeed`` is a 64 byte ``Buffer``, containing the initialization vector (IV) (16 bytes) concatenated with the ciphertext (48 bytes). ``aes-256-cbc`` will be used for decryption.

**Derive a key to sign the Ethereum transaction**

The ``vaultedKeyProvider`` just instantiated can be used to derive further key pairs necessary to complete the registration.
We need to derive a key for signing the Ethereum transaction, which anchors the newly created identity.

.. code-block:: typescript

  const publicEthKey = vaultedKeyProvider.getPublicKey({
    encryptionPass: secret
    derivationPath: JolocomLib.KeyTypes.ethereumKey // "m/44'/60'/0'/0/0"
  })

.. seealso:: In the event that one of your keys becomes compromised, you only lose that one key. All other derived keys (including the most
  important master key) remain secure. Go to `BIP-32 <https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki>`_
  if you want to find out more about this derivation scheme.
  We are currently looking at key recovery solutions in case the master key itself is compromised.

The only arguments that need to be passed to ``getPublicKey`` are the ``derivationPath``, in the format defined in `BIP-32 <https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki>`_, and the ``encryptionPass`` that was used to create the encryption cipher.
The Jolocom library comes equipped with a few predefined paths for generating specific key pairs. The list will expand as new use cases are explored.  You can view the available paths as follows:

.. code-block:: typescript

  console.log(JolocomLib.KeyTypes)

The next step involves transferring a small amount of ether to the Rinkeby address corresponding to the created key pair.

**Transferring ether to the key**

In order to anchor the identity on the Ethereum network, a transaction must be assembled and broadcasted. In order to pay for the assembly and broadcasting, a small amount of ether needs to
be present on the signing key. There are a few ways to receive ether on the Rinkeby test network, and the library also expose a helper function to assist:

.. code-block:: typescript

  await JolocomLib.util.fuelKeyWithEther(publicEthKey)

This will send a request to a `fueling service <https://faucet.jolocom.com/balance>`_ Jolocom is currently hosting.

**Anchoring the identity**

The final step to creating a self-sovereign identity is anchoring the identity on Ethereum and storing the newly created DID document on IPFS.
For these purposes, the ``JolocomRegistry`` can be used; it is essentially an implementation of a `DID resolver <https://w3c-ccg.github.io/did-spec/#did-resolvers>`_.
The creation would look as follows:

.. code-block:: typescript

  const registry = JolocomLib.registries.jolocom.create()
  await registry.create(vaultedKeyProvider, secret)

Behind the scenes, two key pairs are derived from the seed. The first key is used to derive the DID and create a corresponding DID document.
The second key is used to sign the Ethereum transaction, adding the new DID to the registry smart contract.

.. note:: We intend to add support for `executable signed messages <https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1077.md>`_ in the next major release, thereby eliminating the need to derive two key pairs.

Using the identity
###################

The ``create`` function presented in the previous section eventually returns an instance of the ``IdentityWallet`` class, which can be used
to authenticate against services, issue credentials, and request data from other identities.
Later sections will explore the exposed interface in more detail.

In case you have already created your identity, and would like to instantiate an ``IdentityWallet``, you can
simply run:

.. code-block:: typescript

  /**
   * You will need to instantiate a Key Provider using the seed used for identity creation
   * We are currently working on simplifying, and optimising this part of the api
   */

  const registry = JolocomLib.registries.jolocom.create()
  const IdentityWallet = await registry.authenticate(vaultedKeyProvider, {
    derivationPath: JolocomLib.KeyTypes.jolocomIdentityKey,
    encryptionPass: secret
  })

What can I do now?
#########################################

So far, you have successfully created and anchored a digital self-sovereign identity. The subsequent sections cover how to:

* create a public profile and make it available through your DID document;
* issue statements about yourself and others in form of signed `verifiable credentials <https://w3c.github.io/vc-data-model/>`_;
* authenticate against other identities, share and receive signed verifiable credentials, and create various interaction tokens;
* use custom connectors for IPFS and Ethereum communication.
