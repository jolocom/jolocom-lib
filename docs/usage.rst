=====
Usage
=====

This section provides an overview of possible usage patterns that the Jolocom Protocol enables.

Before exploring these usage patterns, please make sure you already have a Jolocom self-sovereign identity. 
The steps for this can be found in the Getting Started section.

********************************
Credentials & Signed Credentials
********************************

Credentials are a way to attach information about an identity to its DidDocument. 
Signed credentials allow the consumer of a signed credentials to resolve cryptographically 
verifiable information about the subject and issuer of the credential.


###################
Create a Credential
###################

There are two ways to create a credential with the Jolocom library. One way is to use the method found on 
the IdentityWallet class. However, because a basic credential is unsigned, it can also be created directly 
on JolocomLib without access to a private key.


**Create a Credential with IdentityWallet**

First, initialize the IdentityWallet class as outlined above. Then, create the credential.

.. code-block:: typescript

  const credential = identityWallet.create.credential({metadata, claim})


The ``create.credential`` method is called with ``metadata`` and ``claim``. 
You can make use of default metadata specifics which are provided with the Jolocom library.

.. note:: Currently, the Jolocom library provides default metadata for name, public profile,
 email address, name, and mobile phone number. Please refer to the specific section on credentials
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

The returned credential is a class which exposes several methods. For example, one such method 
``credential.getType()`` would return an *Array* that looks like this: 

 ['Credential', 'ProofOfEmailCredential']

**Create a Credential directly with JolocomLib**

This method allows you to create a credential without keys.

.. code-block:: typescript

  import { JolocomLib } from 'jolocom-lib'

  const credential = JolocomLib.unsigned.createCredential({metadata, claim})


##########################
Create a Signed Credential
##########################

A signed credential can be created in two ways. You can either create a signed credential
from scratch, or sign an already created or received credential.

**Create a Signed Credential**

.. code-block:: typescript  

  const signedCred = await identityWallet.create.signedCredential({metadata, claim})


**Create a Signed Credential from an existing Credential**

.. code-block:: typescript

  const signedCred = await identityWallet.sign.credential(Credential)

The ``sign.credential`` method is called with an instance of *Credential* as the input parameter.


############################
Validate a Signed Credential
############################

We have two ways to validate the signature of a signed credential. 

If you know the public key of the signing party before starting the signature validation process,
you can use the following way. Note that the ``validateSignatureWithPublicKey`` is called on the instance
of SignedCredential class.

.. code-block:: typescript

  const valid = await signedCred.validateSignatureWithPublicKey(pubKey)


An alternative way is to call ``validateSignature`` on the instance of SignedCredential class.

.. note:: Please note that the passing in of the registry as a parameter will be replaced by a default registry soon.

.. code-block:: typescript
 
  const registry = JolocomLib.registry.jolocom.create({ipfsConnector, ethereumConnector})

  const valid = await signedCred.validateSignature(registry)


**************************
Manage Your Public Profile
**************************
You can attach a public profile to a signing key so that parties who interact with this identity are able to
access basic information about you. This is especially relevant for interactions with online services, 
as the public profile would effectively be the default initial information exchanged between two identities.


Before you start, initialize the IdentityWallet class as outlined in first section. 

###
Add
###


Get the default metadata from the Jolocom library.

.. code-block:: typescript

  import { claimsMetadata } from 'jolocom-lib'

  
  const pubProfileMetadata = claimsMetadata.publicProfile


The default metadata for public profile looks as follows and requires at least the
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

Up until now, you have been making the changes to your identity locally.
Now, you can commit the changes to IPFS and Ethereum.

.. code-block:: typescript
  
  await registry.commit({wallet: identityWallet, ethereumPrivateKey})

######
Update
######

The update functionality is very similar to the add functionality. The only difference is that on add, an error is thrown if a public profile already exists.

######
Delete
######

.. code-block:: typescript

  identityWallet.identity.publicProfile.delete()


  await registry.commit({wallet: identityWallet, ethereumPrivateKey})

Please note that due to the way that IPFS handles the concept of deletion, this delete method simply unpins your public profile from its corresponding pin set, and allows the unpinned data 
to be garbage collected in a 24 hour cycle. Accordingly, if the data has been pinned by another IPFS gateway, complete removal of stored information on the IPFS network cannot be ensured.

###
Get
###

.. code-block:: typescript
  
  const publicProfile = identityWallet.identity.publicProfile.get()

************************************
Credential Based Communication Flows
************************************

Below you will find the credential-based interaction patterns enabled by the Jolocom protocol.

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

  const signedCredReq = identityWallet.sign.credentialRequest(credRequest)


###################################
Consume a Signed Credential Request
###################################

First, use the parse method on the Jolocom library to transform received JSON-LD or JWT data 
into their respective class instances.

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

Signed credential responses can also be received in either JSON-LD or JWT formats, and should be parsed 
accordingly with the parse method supplied by the Jolocom Library.

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



















