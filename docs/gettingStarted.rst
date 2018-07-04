===============
Getting Started
===============

The first step to get started with the jolocom protocol is to create a self sovereign identity.

How to create a Self Sovereign Identity
=======================================

To create a self sovereign identity you first create an Identity Manager.
The Identity Manager is called with ``seed`` which is of type *Buffer* and 
represents entropy from which the master key is derived.

.. code-block:: typescript

  const indetityManager = JolocomLib.identityManager.create(seed)

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

.. code-block:: typescript

  const registry = JolocomLib.registry.jolocom.create({ipfsConnector, ethereumConnector})

At the moment the jolocom registry needs to be initialized with an IPFS connector and an Ethereum connector. 

.. note:: This will change to be initialized with default params in near future.

Now you can use the ``registry`` to trigger the last step of identity creation and registration.

.. code-block:: typescript

  const identityWallet = await registry.create({privateIdentityKey, privateEthereumKey})

Note that the ``create`` method on registry is asynchronous and is called with the two private keys created with the help of identity manager.

The retured identityWallet class gives you signing capabilities and access to your identity details.


What can I do now?
==================

Up to this point you hae successfully created a global self sovereign identity. Now you can use this identity to:

* create a public profile which can be viewed on resolution of your DID
* create self signed claims about your identity
* create multiple personas (coming soon)
* create a credential request to initiate interactions between identities


Please visit our usage section to find out more about possible usage patterns with the Jolocom Protocol.