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
capabilities to add (derive) new child keys which are associated with the respective master key.

.. seealso:: In our architechture we use Hierachical Deterministic Key Derivation.
   Go `here <https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki>`_ if you want to find out more about this concept.  



The Identity Manager is called with ``seed`` which is of type *Buffer* and 
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

``deriveChildKey`` on ``identityManager`` is called with ``path``. Path is of type *string*
and indicates along which 'path' a child key is derived from the master key. The jolocom lib provides
default key paths which should be used during the creation process. You can use them like so:

.. code-block:: typescript

  const schema = identityManager.getSchema()


  const identityKey = identityManager.deriveChildKey(schema.jolocomIdentityKey)


  const ethereumKey = identityManager.deriveChildKey(schema.ethereumKey)

Up till now you have created a master key and child keys needed for a self sovereign identity.
The next step shows how to create your actual identity and register it on ethereum so that it can be used.

**Create the actual Identity**

The first step is to initialize the registry. The registry takes care of communicating to the 
outside world which in our case means to ethereum and to IPFS. During the identity creation process,
the registry takes care of creating and assembling the DidDocument, pushing it to IPFS and registering
the DID on ethereum.


.. code-block:: typescript

  const registry = JolocomLib.registry.jolocom.create({ipfsConnector, ethereumConnector})

At the moment the jolocom registry needs to be initialized with an IPFS connector and an Ethereum connector. 

.. note:: This will change to be initialized with default params in near future.

Now you can use the ``registry`` to trigger the last step of identity creation and registration.

.. code-block:: typescript

  const identityWallet = await registry.create({privateIdentityKey, privateEthereumKey})

Note that the ``create`` method on registry is asynchronous and is called with the two private keys created with the help of identity manager.

The returned identityWallet class gives you signing capabilities and access to your identity details
like the DidDocument details.

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