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

In the context of the Jolocom protocol / stack, an SSI is generally a combination of a DID and a set of signing / encryption / controlling keys. The exact amount and type of cryptographic keys required to act on behalf of a DID depends on the specifics of the used DID Method.

We first instantiate a new `SoftwareKeyProvider` class:

.. code-block:: typescript
  import { walletUtils } from '@jolocom/native-core'
  import { SoftwareKeyProvider } from '@jolocom/vaulted-key-provider'

  const password = 'secretpassword'
  const emptyWallet = SoftwareKeyProvider.newEmptyWallet(walletUtils, 'id:', password)

At this point, an empty wallet (not populated with a DID / keys) is created. Before this wallet can be used, it needs to be provisioned with a DID, and a set of associated keys for signing / encryption / identity management.

The easiest way to populate the wallet with the aforementioned keys is:

.. code-block:: typescript

  const didJolo = new JoloDidMethod()

  const identityWallet = await createIdentityFromKeyProvider(
    emptyWallet,
    password,
    didJolo.registrar
  )

Two of the arguments passed to this function are already familliar, we pass the empty wallet we've just created (it will be populated with keys), as well as the password (it will be used to decrypt the encrypted wallet state, as well as encrypt it afterwards).

The one new argument / concept introduced here is the Did Method abstraction (in this specific example, the ``JoloDidMethod``).

A DID method object contains an implementation for a registrar / resolver acting as described in the corresponding DID Method specification. The registrar implementation included within is delegated all key creation / DID derivation operations. [TODO Include info from the SDK]. Depending on the registrar implementation passed, a different corresponding DID / set of keys will be created.

.. note:: Check out the `jolo-did-methods repository <https://github.com/jolocom/jolo-did-method>`_ for more documentation on this abstraction, as well as the source code for two DID Methods we've integrated with the Jolocom stack.

Please note that the wallet passed to this function needs to either be empty (i.e. the ``id`` value should not be set to a valid DID, and no keys are present), or correctly populated (i.e. the ``id`` value is set to a correct DID matching the registrar's DID Method, and the wallet is populated with the right set of keys, of the right type). In case the wallet is not empty, and populated with a DID / set of keys incpompatible with the passed registrar, an error is thrown.

.. note:: Check out the `SoftwareKeyProvider docmentation <https://github.com/jolocom/vaulted-key-provider>`_ for examples on how to manually populate a wallet instance with keys.


**Reusing an identity**
Given a populated wallet instance, the following alternative to ``createIdentityFromKeyProvider`` can be used to instantiate an identity wallet:

.. code-block:: typescript

  const didJolo = new JoloDidMethod()

  const identityWallet = await authAsIdentityFromKeyProvider(
    emptyWallet,
    password,
    didJolo.resolver
  )

The method is simillar to the one above, except that it does not rely on a registrar, but rather a resolver (responsible for resolving DIDs to DID Documents). This method will attempt to find an existing identity on chain and authentica


.. note:: The password must be 32 bytes long **(the expected encoding is UTF-8)**. In case a password of a different length is provided (e.g. the example above), it will be hashed using ``sha256`` internally before usage. An appropriate warning will be printed to the console.


Using the identity
###################

The ``createIdentityFromKeyProvider`` / ``authAsIdentityFromKeyProvider`` function presented in the previous section eventually returns an instance of the ``IdentityWallet`` class, which can be used
to authenticate against services, issue credentials, and request data from other identities.
Later sections will explore the exposed interface in more detail.

So far, you have successfully created and anchored a digital self-sovereign identity. The subsequent sections cover how to:

* create a public profile and make it available through your DID document;
* issue statements about yourself and others in form of signed `verifiable credentials <https://w3c.github.io/vc-data-model/>`_;
* authenticate against other identities, share and receive signed verifiable credentials, and create various interaction tokens;
* use custom connectors for IPFS and Ethereum communication.
