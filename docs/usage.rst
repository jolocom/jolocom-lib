=====
Usage
=====

This section provides an overview of usage patterns that the jolocom lib enables.


********************************
Create a Self Sovereign Identity
********************************

First create an Identity Manager. The Identity Manager is initialized with ``seed`` which is of type *Buffer*. The seed 
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

The returned identityWallet class gives you signing capabilities and access to your identity details.

**Initialize IdentityWallet Class**

We can initialize the IdentityWallet class by creating a registry and calling the ``authenticate``
method on it with the jolocomIdentity private key

.. code-block:: typescript

  const registry = JolocomLib.registry.jolocom.create({ipfsConnector, ethereumConnector})

  const identityWallet = registry.authenticate(privateIdentityKey)



*******************
Create a Credential
*******************

There are two ways to create a credential with jolocom lib. One way is to use the IdentityWallet class
for it. However, since a credential has no signature, it can also be created direcly on JolocomLib without access
to a private key.

.. note:: Here we assume that a self sovereign identity was already created at some point.

**Create a Credential with IdentityWallet**

First we initialite the identityWallet class by creating a registry and calling the ``authenticate``
method on it with the jolocomIdentity private key.

.. code-block:: typescript

  const credential = identityWallet.create.credential({metadata, claim})


The ``create.credential`` method is called with ``metadata`` and ``claim``. 
You can make use of default metadata specifics which are provided with the jolocom library.

.. note:: Currently jolocom lib provides default metadata for name, public profile,
 email address, name, and mobile phone number. Please check the specific section on credential
 under Protocol Components for more information. 


.. code-block:: typescript

  import { claimsMetadata } from 'jolocom-lib'

  
  const emailMetadata = claimsMetadata.emailAddress



.. code-block:: typescript

  const myClaim = { 
    
    id: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af'
    
    email: 'hello@jolocom.com'
 
  }

  
  const credential = identityWallet.create.credential({
    
    metadata: emailMetadata,
    
    claim: myClaim
  
  })

The returned credential is a class which exposes several methods, like ``credential.getType()`` which
in our example above would return an *Array* that looks like this: 

 ['Credential', 'ProofOfEmailCredential']

**Create a Credential directly with JolocomLib**

.. code-block:: typescript

  import { JolocomLib } from 'jolocom-lib'

  const credetial = JolocomLib.unsigned.createCredential({metadata, claim})


**************************
Create a Signed Credential
**************************

A signed credential can be created via two ways. You can either create a signed credential
from scratch or sign an already created credential.

**Create a Signed Credential**

.. code-block:: typescript  

  const signedCred = await identityWallet.create.signedCredential({metadata, claim})



**Create a Signed Credential from an existing Credential**

.. code-block:: typescript

  const signedCred = await identityWallet.sign.credential(Credential)

The ``sign.credential`` method is called with class *Credential* as input param.


**************************
Manage your Public Profile
**************************

Coming soon.

****************************
Validate a Signed Credential
****************************

Coming soon.

**************************
Create a Credential Request
**************************


Coming soon.


*****************************
Validate a Credential Response
*****************************

Coming soon.



















