=====
Usage
=====

This section provides an overview of possible usage patterns that the Jolocom Protocol enables.


********************************
Create a Self Sovereign Identity
********************************

##################
Create an Identity
##################

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

###############################
Initialize IdentityWallet Class
###############################

In case you already created an identity with the jolocom lib you can initialize the IdentityWallet class 
by creating a registry and calling the ``authenticate`` method on it with the jolocomIdentity private key.

.. code-block:: typescript

  const registry = JolocomLib.registry.jolocom.create({ipfsConnector, ethereumConnector})

  const identityWallet = registry.authenticate(privateIdentityKey)


********************************
Credentials & Signed Credentials
********************************

Credentials and Signed Credentials are a way to attach information to a DID. Signed credentials
give you the benefit to express cryptographically verifiable information - so that the consumer of this
signed credentials is able to resolve information about the issuer plus establish validity of the signature. 


###################
Create a Credential
###################

There are two ways to create a credential with jolocom lib. One way is to use the IdentityWallet class
for it. However, since a credential has no signature, it can also be created direcly on JolocomLib without access
to a private key.


**Create a Credential with IdentityWallet**

First, initialize the IdentityWallet class as outlined above. Then create the credential.

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


##########################
Create a Signed Credential
##########################

A signed credential can be created via two ways. You can either create a signed credential
from scratch or sign an already created or received credential.

**Create a Signed Credential**

.. code-block:: typescript  

  const signedCred = await identityWallet.create.signedCredential({metadata, claim})


**Create a Signed Credential from an existing Credential**

.. code-block:: typescript

  const signedCred = await identityWallet.sign.credential(Credential)

The ``sign.credential`` method is called with class *Credential* as input param.


############################
Validate a Signed Credential
############################

We have two ways to validate the signature of a signed credential. 

In case you know the public key of the signing party before starting the signature validation,
you can use the following way. Note that the ``validateSignatureWithPublicKey`` is called on the instance
of SignedCredential class.

.. code-block:: typescript

  const valid = await signedCred.validateSignatureWithPublicKey(pubKey)


The alternative way is to call ``validateSignature`` on the instance of SignedCredential class.

.. note:: Please note that passing the registry as param will be replaced by a default registry soon.

.. code-block:: typescript
 
  const registry = JolocomLib.registry.jolocom.create({ipfsConnector, ethereumConnector})

  const valid = await signedCred.validateSignature(registry)


**************************
Manage Your Public Profile
**************************
You can attach a public profile to a signing key so that parties who interact with this identity are able to
resolve more information about you. This is especially relevant for online services as the public profile would be
the first point of contact between two identities.


Before you start, initialize the IdentityWallet class as outlined in first section. 

###
Add
###


Get the default metadata from the jolocom lib.

.. code-block:: typescript

  import { claimsMetadata } from 'jolocom-lib'

  
  const pubProfileMetadata = claimsMetadata.publicProfile


The default metadata for public profile looks as follows and requires at least
``name`` and ``about`` fields to be filled out. You can also add ``image`` and ``url``.

.. literalinclude:: ../ts/index.ts
  :language: typescript
  :lines: 63-75

Your public profile is essentially a signed credential which is associated with
your DID. Create the signed credential.

.. code-block:: typescript
  
  const myDID = identityWallet.getIdentity().getDID()

  const myPublicProfile = {
    
    id: myDID,
    
    name: 'Jolocom',
    
    about: 'We enable a global identity system'
  
  }

    
  const publicProfileCred = idnentityWallet.create.signedCredential({
   
    metadata: publicProfileMetadata,
   
    claim: myPublicProfile
  
  })

Now add the created public profile to your identity.

.. code-block:: typescript

  identityWallet.identity.publicProfile.add(publicProfileCred)

Up till now you have made the changes to your identity locally.
Now you can commit the changes to ipfs and ethereum.

.. code-block:: typescript
  
  await registry.commit({wallet: identityWallet, ethereumPrivateKey})

######
Update
######

The update functionality is very similar to the add functionality.
The only difference is that on add it throws an error if a public profile already exists.

######
Delete
######

.. code-block:: typescript

  identityWallet.identity.publicProfile.delete()


  await registry.commit({wallet: identityWallet, ethereumPrivateKey})


###
Get
###

.. code-block:: typescript
  
  const publicProfile = identityWallet.identity.publicProfile.get()


************************************
Credential Based Communication Flows
************************************

Below you will find the credential based interactions enabled by the Jolocom protocol.
Creation and consumption examples show the interaction patterns between identities. 

##################################
Create a Signed Credential Request
##################################

We have two ways to create a signed credential request.

**Create Signed Credential Request from Credential Request**

.. code-block:: typescript

  const credRequest = identityWallet.create.credentialRequest({callbackURL, credentialRequirements})

  const signedCredReq = identityWallet.create.signedCredentialRequest(credRequest)


**Create a Signed Credential Request by signing a Credential Request**

.. code-block:: typescript
 
  const credRequest = identityWallet.create.credentialRequest({callbackURL, credentialRequirements})

  const signedCredReq = idnetityWallet.sign.credentialRequest(credRequest)


###################################
Consume a Signed Credential Request
###################################

First, use the parse functionality of jolocom lib to transform received data into respective class instance. 
We have two ways to send a signed reponse - as json or as a JWT. Use the parser accordingly.

.. code-block:: typescript

  // JSON case
  const signedCredReq = JolocomLib.parse.signedCredentialRequest.fromJSON(receivedSignedCredReq)

  // JWT case
  const signedCredReq = JolocomLib.parse.signedCredentialRequest.fromJWT(receivedSignedCredReq)


TODO: finish this flow documentation.

###################################
Create a Signed Credential Response
###################################

Coming soon.

####################################
Consume a Signed Credential Response
####################################

First, use the parse functionality of jolocom lib to transform received data into respective class instance. 
We have two ways to send a signed reponse - as json or as a JWT. Use the parser accordingly. 

.. code-block:: typescript

  // JSON case
  const signedCredResp = JolocomLib.parse.signedCredentialResponse.fromJSON(receivedSignedCredResp)

  // JWT case
  const signedCredResp = JolocomLib.parse.signedCredentialResponse.fromJWT(receivedSignedCredResp)

Now you can use the methods provided by ``SignedCredentialResponse`` class.


.. code-block:: typescript

  // credential request you send

  const credRequest = identityWallet.create.credentialRequest({callbackURL, credentialRequirements})

  
  
  const registry = JolocomLib.registry.jolocom.create({ipfsConnector, ethereumConnector})

  const validSignature = signedCredResp.validateSignature(registry)
  
  const satisfiesRequest = signedCredResp.satisfiesRequest(credRequest)
  
  const receivedCreds = signedCredResp.getSuppliedCredentials()

  
  // example for check of supplied signed credential

  const validCred = await receivedCreds[0].validateSignature(registry)


**********************************
Interactions With Other Identities
**********************************

Coming soon.



















