Credential Based Communication Flows
======================================

This section provides an overview of the interaction flows supported by the Jolocom Library.

.. note:: Most of these flows require an anchored Jolocom identity. If you did not yet create one, make sure to check the `Getting Started <https://jolocom-lib.readthedocs.io/en/latest/gettingStarted.html>`_ section first.

Below you will find the credential-based interaction patterns enabled by the Jolocom protocol.

Create a Signed Credential Request
####################################

We have two ways to create a signed credential request.

**Create Signed Credential Request from Credential Request**

.. code-block:: typescript

  const credRequest = identityWallet.create.credentialRequest({callbackURL, credentialRequirements})

  const signedCredReq = identityWallet.create.signedCredentialRequest(credRequest)


**Create a Signed Credential Request by signing a Credential Request**

.. code-block:: typescript
 
  const credRequest = identityWallet.create.credentialRequest({callbackURL, credentialRequirements})

  const signedCredReq = identityWallet.sign.credentialRequest(credRequest)


Consume a Signed Credential Request
#####################################

First, use the parse method on the Jolocom library to transform received JSON-LD or JWT data 
into their respective class instances.

.. code-block:: typescript

  // JSON case
  const signedCredReq = JolocomLib.parse.signedCredentialRequest.fromJSON(receivedSignedCredReq)

  // JWT case
  const signedCredReq = JolocomLib.parse.signedCredentialRequest.fromJWT(receivedSignedCredReq)

Create a Signed Credential Response
#####################################

Coming soon.

Consume a Signed Credential Response
#####################################

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


Interactions With Other Identities
###################################

Coming soon.