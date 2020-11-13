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


.. note:: To use the library in a browser or a react native environment additional polyfilling is required. For an example of integrating this library with a react native application, please see the `Jolocom SmartWallet metro configuration <https://github.com/jolocom/smartwallet-app/blob/develop/metro.config.js>`_.


How to create a self-sovereign identity
#########################################

In the context of the Jolocom protocol / stack, an SSI is esentially a combination of a DID and a set of signing / encryption / controlling keys. The exact number and type of cryptographic keys required depends on the requirements of the used DID Method.

Before a new identity can be created, a new ``SoftwareKeyProvider`` instance is required. This class is responsible for managing the cryptographic material associated with an identity. An empty key provider can be instantiated as follows:

.. code-block:: typescript

  import { walletUtils } from '@jolocom/native-core'
  import { SoftwareKeyProvider } from '@jolocom/vaulted-key-provider'

  const password = 'secretpassword'

  SoftwareKeyProvider.newEmptyWallet(walletUtils, 'id:', password).then(emptyWallet => {
    console.log(emptyWallet)
  })

At this point ``emptyWallet`` is not yet populated with a DID or any signing / encryption / identity management keys. The easiest way to configure the wallet with the required keys is to use the ``createIdentityFromKeyProvider`` helper provided by the Jolocom library:

.. code-block:: typescript

  import { createIdentityFromKeyProvider } from 'jolocom-lib/js/didMethods/utils'
  import { JolocomLib } from 'jolocom-lib'

  const didJolo = JolocomLib.didMethods.jolo

  // The emptyWallet created in the previous examaple

  createIdentityFromKeyProvider(
    emptyWallet,
    password,
    didJolo.registrar
  ).then(identityWallet => {
    console.log(identityWallet.did)
  })


The function takes an ``emptyWallet`` and the corresponding encryption ``password`` as the first two arguments. The ``password`` will be used to decrypt the wallet contents before adding new keys / changing the associated DID / storing metadata, etc. Once the wallet state has been updated, the same password is used to encrypt the new state.

.. note:: Please note that this function mutates the contents of the wallet instance passed as an argument.
   I.e. if the creation is succesful, the ``emptyWallet.id`` will be set to the new DID, and the `emptyWallet.getPubKeys` method will return all populated keys.

Deriving the required keys, as well as the wallet DID is fully delegated to the ``IRegistrar`` instance passed as the third argument. Internally, the ``registrar`` has access to the passed ``SoftwareKeyProvider`` instance, and can generate and persist all required keys according to the DID method specification. This approach results in greater flexibility when deriving keys (since the behaviour is fully encapsulated in the ``registrar``), allowing for various approaches to cater to different needs (for instance, the ``JoloDidMethod`` and the ``LocalDidMethod`` modules internally rely on specifications such as `BIP32 <https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki>`_ and `SLIP0010 <https://github.com/satoshilabs/slips/blob/master/slip-0010.md>`_ respectively for HD key derivation and simpler backups / recovery).

To reiterate, the ``registrar`` implementation encapsulates the specification(s) employed for deriving keys (including metadata required for derivation, such as paths, indexes, etc.), as well as the process for deriving a DID based on the aforementioned keys.

Provisioning the ``SoftwareKeyProvider`` with keys and a DID is the first step of the identity creation process. At this point, a DID Document (which indexes the keys and DID we've just created) can be created and "anchored" (the exact opperations are DID method specific, and might for example entail creatting a record mapping the newly created DID and the DID Document in a `verifiable data registry <https://www.w3.org/TR/did-core/#dfn-verifiable-data-registry>`_).

.. note:: For more documentation on the ``DidMethod`` abstraction, as well as examples of DID methods integrated with the Jolocom stack, check out the `jolo-did-method <https://github.com/jolocom/jolo-did-method>`_ and the `local-did-method <https://github.com/jolocom/local-did-method>`_ repositories.

Please note that the wallet passed to this function is generally expected to be empty (i.e. the ``wallet.id`` value should not be set to a valid DID, and no keys should be present), with the configuration fully deligated to the specified ``registrar``.

The ``JoloDidMethod`` and ``LocalDidMethod`` registrars can also create an identity using a correctly populated wallet (i.e. the ``id`` value is set to a correct DID matching the ``registrar's`` DID method prefix, and the wallet is populated with the right set of keys, of the right type. In this case, the key / DID generation steps are skipped, and the anchoring operations are fired right away. Whether this functionality is supported or not depends on the ``registrar`` implementation used.

**In case the wallet is not empty, and populated with a DID / set of keys incpompatible with the passed registrar, an error is thrown.**

.. note:: Check out the `SoftwareKeyProvider docmentation <https://github.com/jolocom/vaulted-key-provider>`_ for examples on how to manually populate a wallet instance with keys.

How to reuse a self-sovereign identity
#########################################

At later points, the identity can be reused if a ``SoftwareKeyProvider`` provisioned with the corresponding keys is available. The corresponding ``SoftwareKeyProvider`` can be instantiated in a number of ways (e.g. the wallet's encrypted contents can be persisted to storage, and read / decrypted later, or a BIP39 / SLIP0010 mnemonic can be saved as part of identity creation, and then retrieved / used to derive all required keys).

Given a populated wallet instance, the following alternative to ``authAsIdentityFromKeyProvider`` can be used to instantiate the identity:

.. code-block:: typescript

  import { JolocomLib } from 'jolocom-lib'
  import { authAsIdentityFromKeyProvider } from 'jolocom-lib/js/didMethods/utils'

  const didJolo = JolocomLib.didMethods.jolo

  // E.g. using the previously created / populated SoftwareKeyProvider instance
  authAsIdentityFromKeyProvider(
    emptyWallet,
    password,
    didJolo.resolver
  ).then(identityWallet => console.log(identityWallet.did))

The function is simillar to the helper we've used to create the identity, except that this function will not attempt to "anchor" the identity but rather it will try to resolve (as defined by the corresponding DID method specification) an existing identity based on the DID / keys held by the passed ``SoftwareKeyProvider`` instance. This can

.. note:: For further examples of identity creation scenarios, check out the `Jolocom-SDK documentation <https://jolocom.github.io/jolocom-sdk/1.0.0-rc11/guides/identity/#creating-an-identity>`_
