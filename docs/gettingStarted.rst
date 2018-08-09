===============
Getting Started
===============

The first step to start using the Jolocom protocol is to make sure to install the Jolocom library as a dependency in your project.
You can use npm to do this.

.. code-block:: terminal

  npm install jolocom-lib --save


.. warning:: Please be aware that we are still in the alpha stage, and the Jolocom Protocol currently runs on the Ethereum testnet. Do not send any 'real' ether to your address. 


How to create a Self-Sovereign Identity
=======================================

The creation of a self-sovereign identity comprises several steps:

* Create an Identity Manager
* Derive child keys
* Create the actual identity

These steps are outlined in detail below.

**Create an Identity Manager**

The creation of a self-sovereign identity starts with the instantiation of an Identity Manager. 
The Identity Manager class contains methods enabling the derivation of new child keys from the master key. 
Because of security reasons, the master key is never used for interactions — all interactions by your identity 
are based on child keys.

The Identity Manager is initialized with a ``seed`` which is a *Buffer* and 
represents the entropy from which the master key has been derived.

.. code-block:: typescript

  import { JolocomLib } from 'jolocom-lib'

  const identityManager = JolocomLib.identityManager.create(seed)

**Derive Child Keys**

Now you can use the ``identityManager`` to derive child keys. For a self-sovereign identity,
we need to derive at least two keys. The first one is the identity key which is used for signing.
The second one is an Ethereum key which is used for registering the identity on the Ethereum
blockchain.  

.. code-block:: typescript

  const identityKey = identityManager.deriveChildKey(path)

.. seealso:: As mentioned before, multiple personas are enabled through Hierachical Deterministic Key Derivation. 
If any of your child keys is compromised, you only lose one key. All other derived keys (including the most 
important master key) remain secure. Go to `BIP-32 <https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki>`_ 
if you want to find out more about this derivation scheme. 

``deriveChildKey`` on ``identityManager`` is called with ``path``. Path is a *string* and is a concept explored in previously mentioned  BIP 32 -
it indicates along which 'path' a child key is derived from the master key. The Jolocom library provides
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
  
Up until this step, you have created a master key and child keys needed for a self-sovereign identity.
The next step shows how to create your actual identity and register it on an Ethereum registry contract 
so that it can be used.

**Create the Identity**

The first step is to initialize the registry. The registry takes care of interactions with 
Ethereum and IPFS. During the identity creation process, the registry assembles the DidDocument, pushes it to IPFS 
and creates a mapping of the DID to the resulting IPFS hash pointing to the DidDocument. This mapping is then registered
on Ethereum in the form of a record on the deployed registry smart contract.

.. code-block:: typescript

  const registry = JolocomLib.registry.jolocom.create({ipfsConnector, ethereumConnector})

The Jolocom registry needs to be initialized with an `IPFS connector <https://github.com/jolocom/jolocom-lib/blob/master/ts/ipfs/types.ts#L7>`_ and an `Ethereum connector <https://github.com/jolocom/jolocom-lib/blob/master/ts/ethereum/types.ts#L12>`_, but if you don't provide them, it will be initialized with default Jolocom connectors.
Before you can finish the registration process, you need to make sure you fuel your Ethereum key for the Rinkeby testnet. 

Note that the IPFS connector supplied with the Jolocom Library defaults to the configuration for the 
Jolocom IPFS cluster. However, you can use another IPFS gateway by using an IpfsStorageAgent instantiated 
from a custom configuration as the IPFS connector.

Additionally, in our Smartwallet and SSO example page, we use our own fueling service. You're welcome to 
use it to create your or your service's identity, but please don't put too much load on it. 
`Here's <https://github.com/jolocom/smartwallet-app/blob/develop/src/lib/ethereum.ts#L21>`_ an example, 
the ``fueling endpoint`` should be ``https://faucet.jolocom.com/request``. In the next release of the 
library we will include a wrapper for the fueling service.

Now you can use the ``registry`` for the last steps of identity creation and registration.

.. code-block:: typescript

  const identityWallet = await registry.create({privateIdentityKey, privateEthereumKey})

Note that the ``create`` method on registry is asynchronous and is called with the two private keys created by the identity manager -  make sure you are passing ``privateKey``, not the full object returned by ``deriveKey`` method.

The returned identityWallet class gives you signing capabilities and access to your identity details 
via the Identity class with the DidDocument object as a member.

.. seealso:: With the Jolocom Protocol we try to use open standards whenever we can.
  The DID/DidDocument approach is a W3C open standard. Find out more about it `here <https://w3c-ccg.github.io/did-spec/>`_.  

What can I do now?
==================

Up to this point, you have successfully created a global self-sovereign identity. Now you can use 
this identity to:

* create a public profile as part of your DidDocument
* create self signed claims about your identity
* create multiple personas (coming soon)
* create a credential request to initiate interactions between identities


Please visit our usage section to find out more about possible usage patterns with the Jolocom Protocol.