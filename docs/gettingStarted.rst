Getting Started
===============

How to install the Jolocom library
###################################

To begin using the Jolocom protocol, first install the Jolocom library as a dependency in your project. You can use ``npm`` or ``yarn`` to do so:

.. code-block:: bash

  # using npm
  npm install jolocom-lib --save

  # using yarn
  yarn add jolocom-lib

.. warning:: Please be aware that the Jolocom library is still undergoing active development. All identities are currently anchored on the Rinkeby testnet.

  Please do not transfer any real ether to your Jolocom identity.


How to create a self-sovereign identity
#########################################

In broad strokes, the creation of a self-sovereign identity comprises the following steps:

* Instantiate the ``SoftwareKeyProvider`` class by providing a 32 byte random seed ``Buffer``, and a password for encryption
* Use the ``keyProvider`` to derive two keys, one to control your Jolocom identity, the other to sign Ethereum transactions
* Transfer a small amount of ether to your second key to later pay for updating the registry contract
* Instantiate and use a ``JolocomRegistry`` to anchor the newly created DID document on the Ethereum network

The following sections present these steps in greater detail.

**Instantiate the Key Provider class**

The ``SoftwareKeyProvider`` class abstracts all functionality related to `deriving key pairs <https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki>`_ and creating / validating cryptographic signatures.
The 32 byte seed used to instantiate the key provider is persisted in the instance, encrypted using the provided password.  Therefore, all operations which involve key derivation require the password as well.
This is what instantiating a key provider looks like:

.. code-block:: typescript

  import { JolocomLib } from 'jolocom-lib'
  import { crypto } from 'crypto'

  // Feel free to use a better rng module
  const seed = crypto.randomBytes(32)
  const password = 'correct horse battery staple'

  const vaultedKeyProvider = new JolocomLib.KeyProvider(seed, password)

.. note:: In the next release, the constructor will be modified to require only the encrypted seed value, thereby reducing the amount of time during which the seed is exposed.

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

  const registry = JolocomLib.registries.create()
  const IdentityWallet = await registry.authenticate(vaultedKeyProvider, {
    derivationPath: JolocomLib.KeyTypes.jolocomIdentityKey,
    decryptionPass: secret
  })

What can I do now?
#########################################

So far, you have successfully created and anchored a digital self-sovereign identity. The subsequent sections cover how to:

* create a public profile and make it available through your DID document;
* issue statements about yourself and others in form of signed `verifiable credentials <https://w3c.github.io/vc-data-model/>`_;
* authenticate against other identities, share and receive signed verifiable credentials, and create various interaction tokens;
* use custom connectors for IPFS and Ethereum communication.