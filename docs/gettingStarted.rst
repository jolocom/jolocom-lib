Getting Started..
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

In the context of the Jolocom protocol / stack, an SSI is esentially a combination of a DID and a set of signing / encryption / controlling keys. The exact amount and type of cryptographic keys required to act on behalf of a DID depends on the specifics of the used DID Method.

We first instantiate a new empty `SoftwareKeyProvider` instance:

.. code-block:: typescript
  import { walletUtils } from '@jolocom/native-core'
  import { SoftwareKeyProvider } from '@jolocom/vaulted-key-provider'

  const password = 'secretpassword'
  const emptyWallet = SoftwareKeyProvider.newEmptyWallet(walletUtils, 'id:', password)

At this point ``emptyWallet`` is not yet configured with a DID or any signing / encryption / identity management keys. The easiest way to configure the wallet with the required keys is to use the ``createIdentityFromKeyProvider`` helper exported by the library:

The easiest way to populate the wallet with the aforementioned keys is:

.. code-block:: typescript

  const didJolo = new JoloDidMethod()

  const identityWallet = await createIdentityFromKeyProvider(
    emptyWallet,
    password,
    didJolo.registrar
  )

The function takes an ``emptyWallet`` and the corresponding encryption ``password`` as it's first two arguments. The ``password`` will be used to decrypt the wallet contents before adding new keys / modifying it, as well as to encrypt the wallet contents afterwards.

The key derivation, as well as the DID provisioning is fully delegated to the ``IRegistrar`` instance passed as the third argument.
Internally, the ``registrar`` has access to the passed ``SoftwareKeyProvider`` instance, and can generate and persist all required keys according to the DID method specification (for instance, the ``JoloDidMethod`` and the ``LocalDidMethod`` modules make use of `BIP32<https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki>`_ and `SLIP0010<https://github.com/satoshilabs/slips/blob/master/slip-0010.md>`_ respectively for generating / managing multiple keys).
The ``registrar`` implementation encapsulates the specification(s) employed for deriving keys (including metadata required for derivation, such as paths, indexes, etc.), as well as the process for deriving a DID based on the aforementioned keys.

Provisioning the ``SoftwareKeyProvider`` with keys and a DID is the first step of the identity creation process. At this point, a DID Document (which lists the previously created keys and DID) can be created and "anchored" (e.g. create a mapping between a DID and the DID Document in some `verifiable data registry <https://www.w3.org/TR/did-core/#dfn-verifiable-data-registry>`_). The process / meaning for the "anchoring" operation is defined as part of the corresponding DID method specification.

.. note:: For more documentation on the ``DidMethod`` abstraction, as well as examples of DID methods integrated with the Jolocom stack, check out the `jolo-did-method <https://github.com/jolocom/jolo-did-method>`_ and the `local-did-method <https://github.com/jolocom/local-did-method>`_ repositories.

Please note that the wallet passed to this function is generally expected to be empty (i.e. the ``id`` value should not be set to a valid DID, and no keys should be present), with the configuration fully deligated to the specified ``registrar``.

The ``JoloDidMethod`` and ``LocalDidMethod`` registrars can also create an identity using a correctly populated wallet (i.e. the ``id`` value is set to a correct DID matching the ``registrar's`` DID method prefix, and the wallet is populated with the right set of keys, of the right type. In this case, the key / DID generation steps are skipped, and the anchoring operations are fired right away. Whether this functionality is supported or not depends on the ``registrar`` implementation used.

**In case the wallet is not empty, and populated with a DID / set of keys incpompatible with the passed registrar, an error is thrown.**

.. note:: Check out the `SoftwareKeyProvider docmentation <https://github.com/jolocom/vaulted-key-provider>`_ for examples on how to manually populate a wallet instance with keys.

**Reusing an identity**
At later points, the identity can be reused if a ``SoftwareKeyProvider`` provisioned with the corresponding keys is available. The corresponding ``SoftwareKeyProvider`` can be instantiated in a number of ways (e.g. the wallet's encrypted contents can be persisted to storage, and read / decrypted later, or a BIP39 mnemonic can be saved as part of identity creation, and then retrieved / used to derive all required keys).

Given a populated wallet instance, the following alternative to ``authAsIdentityFromKeyProvider`` can be used to instantiate the identity:

.. code-block:: typescript

  const didJolo = new JoloDidMethod()

  // The emptyWallet is no longer empty, because createIdentityFromKeyProvider mutates it's contents
  const identityWallet = await authAsIdentityFromKeyProvider(
    emptyWallet,
    password,
    didJolo.resolver
  )

The function is simillar to the helper we've used to create the identity, except that this function will not attempt to "anchor" the identity but rather it will try to resolve (as defined by the corresponding DID method specification) an existing identity based on the DID / keys held by the passed ``SoftwareKeyProvider`` instance.

Using the identity
###################

So far, you have successfully created and anchored a digital self-sovereign identity. The subsequent sections cover how to:

* create a public profile and make it available through your DID document;
* issue statements about yourself and others in form of signed `verifiable credentials <https://w3c.github.io/vc-data-model/>`_;
* authenticate against other identities, share and receive signed verifiable credentials, and create various interaction tokens;
* use custom connectors for IPFS and Ethereum communication.
