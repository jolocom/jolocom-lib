===============
Getting Started
===============

The first step to start using the Jolocom protocol is to make sure to install jolocom lib as a dependency in your project.
You can use npm to do this.

.. code-block:: terminal

  npm install jolocom-lib --save


.. warning:: Please be aware that the Jolocom Protocol is a work in progress right now.
  Also, our protocol runs on the Ethereum testnet. Do not send any 'real' ether to your address. 


How to create a Self Sovereign Identity
=======================================

The creation of a self sovereign identity encompasses several steps which are:

* Create an Identity Manager
* Derive Child Keys
* Create the actual Identity

These steps are outlined in detail below.



**Create an Identity Manager**

To create a self sovereign identity you first create an Identity Manager. This gives you the
capabilities to derive new child keys from the master key. Because of security, you never use master key directly - all the interactions of your identity are based on child keys.

The Identity Manager is initialized with ``seed`` which is a *Buffer* and 
represents entropy from which the master key is derived.

.. code-block:: typescript

  import { JolocomLib } from 'jolocom-lib'

  const indetityManager = JolocomLib.identityManager.create(seed)

**Derive Child Keys**

Now you can use the ``identityManager`` to derive child keys. For a self sovereign identity
we need to derive at least two keys. The first one is the identity key which is used for signing.
The second one is an ethereum key which is used for registering the identity on the ethereum
blockchain.  

.. code-block:: typescript

  const identityKey = identityManager.deriveChildKey(path)

.. seealso:: In our architecture we use Hierachical Deterministic Key Derivation. If any of your child keys is compromised, you only lose one key and all the others (including the most important master key) are intact. 
   Go to `BIP-32 <https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki>`_ if you want to find out more about this concept. 

``deriveChildKey`` on ``identityManager`` is called with ``path``. Path is a *string* and is a concept explored in previously mentioned  BIP 32 -
it indicates along which 'path' a child key is derived from the master key. The jolocom lib provides
default key paths which should be used during the creation process. You can use them like so:

.. code-block:: typescript

  const schema = identityManager.getSchema()


  const identityKey = identityManager.deriveChildKey(schema.jolocomIdentityKey)


  const ethereumKey = identityManager.deriveChildKey(schema.ethereumKey)

``deriveChildKey`` returns the following object: 
 
.. code-block:: typescript 

	{ 
  		wif: string,
  		privateKey: Buffer,
  		publicKey: Buffer,
  		keyType: string,
  		path: string
	}
  
Up till now you have created a master key and child keys needed for a self sovereign identity.
The next step shows how to create your actual identity and register it on ethereum so that it can be used.

**Create the Identity**

The first step is to initialize the registry. The registry takes care of communicating to the 
outside world which in our case means Ethereum and IPFS. During the identity creation process,
the registry assembles the DidDocument, pushes it to IPFS and registers
the DID and a reference to the DDO (IPFS hash) on ethereum.

.. code-block:: typescript

  const registry = JolocomLib.registry.jolocom.create({ipfsConnector, ethereumConnector})

The Jolocom registry needs to be initialized with an `IPFS connector <https://github.com/jolocom/jolocom-lib/blob/master/ts/ipfs/types.ts#L7>`_ and an `Ethereum connector <https://github.com/jolocom/jolocom-lib/blob/master/ts/ethereum/types.ts#L12>`_, but if you don't provide them, it will be initialized with default Jolocom connectors.
Before you can finish the registration process, you need to make sure you fuel your Ethereum key with gas. 

In our Smartwallet and SSO example page, we use our own Fueling service. You're welcome to use it to create your or your service's identity, but please don't put too much load on it. `Here's <https://github.com/jolocom/smartwallet-app/blob/develop/src/lib/ethereum.ts#L21>`_ an example, the ``fueling endpoint`` should be ``https://faucet.jolocom.com/request``. In the next release of the library we will include a wrapper for the Fueling service.

Now you can use the ``registry`` to trigger the last step of identity creation and registration.

.. code-block:: typescript

  const identityWallet = await registry.create({privateIdentityKey, privateEthereumKey})

Note that the ``create`` method on registry is asynchronous and is called with the two private keys created by the identity manager -  make sure you are passing ``privateKey``, not the full object returned by ``deriveKey`` method.

The returned identityWallet class gives you signing capabilities and access to your identity details - Identity class with DidDocument object as a member.

.. seealso:: With the Jolocom Protocol we try to use open standards whenever we can.
  The DID/DidDocument approach is a W3C open standard. Find out more about it `here <https://w3c-ccg.github.io/did-spec/>`_.  

What can I do now?
==================

Up to this point you have successfully created a global self sovereign identity. Now you can use this identity to:

* create a public profile which can be viewed on resolution of your DID
* create self signed claims about your identity
* create multiple personas (coming soon)
* create a credential request to initiate interactions between identities


Please visit our usage section to find out more about possible usage patterns with the Jolocom Protocol.