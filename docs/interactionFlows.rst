Credential Based Communication Flows
======================================

Identities can interact between each other in incredibly complex ways. We currently support a number of quite
simple interaction flows, with the intention of greatly expanding the list in the upcoming releases.

This section is meant to provide a detailed overview of the interaction flows supported by the Jolocom Library.

.. note:: The following sections assume you have already created an identity. If you haven't yet, check out the `getting started <https://jolocom-lib.readthedocs.io/en/latest/gettingStarted.html>`_ section.

Request credentials from another identity
####################################

Many services require the user to provide certain information upon signing up.
The Jolocom library provides a simple way for services to present their requirements to authenticating users through defining and presenting what we call a credential request.
We will first look at how we can generate the aforementioned request.

**Create a Credential Request**

.. code-block:: typescript

  // An instance of an identityWallet is required at this point
  const credentialRequest = await identityWallet.create.interactionTokens.request.share({
    callbackURL: 'https://example.com/authentication/',
    credentialRequirements: [{
      type: ['Credential', 'ProofOfEmailCredential'],
      constraints: []
    }],
  }, password)

.. note:: Documentation on what ``constraints`` are, and how they can be used to create more specific
  constraints will be added shortly.

.. note:: For further documentation and examples of how to create and send 
  credential requests, check the `api documentation <https://htmlpreview.github.io/?https://raw.githubusercontent.com/jolocom/jolocom-lib/master/api_docs/documentation/classes/credentialrequest.html>`_,
  the `demo service implementation <https://github.com/jolocom/demo-sso>`_, and the `integration tests <https://github.com/jolocom/jolocom-lib/tree/master/tests/integration>`_.

The easiest way to make the credential request consumable for the client applications is to encode it
as a `JSON Web Token <https://jwt.io/introduction/>`_. This allows us to easily validate signatures on individual messages, and prevent some replay attacks.

In order to make the credential request consumable by the `Jolocom SmartWallet <https://github.com/jolocom/smartwallet-app>`_ we need to further
encode the ``JSON Web Token`` as a QR code that can be scanned by the wallet. You can encode the ``credentialRequest`` as follows:

.. code-block:: typescript

  // Will be deprecated in future releases in favor of more user friendly and intuitive ways to encoding data
  const jwtEncoded = credentialRequest.encode()
  const QREncoded = new SSO().JWTtoQR(jwtEncoded)

Further encodings will be added as the architecture continues to mature.

**Consume a Signed Credential Request**

On the client side, we can decode and validate the received credential request as follows:

.. code-block:: typescript

  import { JSONWebToken } from "./interactionFlows/JSONWebToken"

  const credentialRequest = JolocomLib.parse.interactionToken.fromJWT(enc)

  const credentialRequest = JolocomLib.parse.interactionToken.fromJWT(enc)
  identityWallet.validateJWT(credentialRequest)

.. note:: The ``validateJWT`` method will ensure the credential is not expired, and that it contains a valid signature.

We will look at how to craft the corresponding response in the next section.

Provide credentials to another identity
#####################################

Once the service has assembled and broadcasted the credential request, the client can parse it and assemble a valid response.
The following sections will show how this can be done.

**Create a Credential Response**

On the client side, after we have received the encoded credential request, we want to prepare and send a corresponding credential response:

.. code-block:: typescript


  /** 
   * The callback url has to match the one in the request,
   * will be populated autmoatically based on the request starting from next major release
   */

  const credentialResponse = awaitidentityWallet.create.interactionTokens.response.share({
      callbackURL: credentialRequest.payload.interactionToken.callbackURL,
      suppliedCredentials: [signedEmailCredential.toJSON()] // Provide signed credentials of requested type
    },
    encryptionPass, // The password to decrypt the seed for key generation as part of signing the JWT
    credRequest // The received request, used to set the 'nonce' and 'audience' field on the created response
  )

In this case, it so happens that the credential we supplied happens to match what the service requested.
In order to ensure that we don't accidently provide credentials that do not correspond to the service requirements,
we can use the following method to filter:

.. code-block:: typescript

  // We assume the client application has multiple credentials persisted in a local database
  const localCredentials = [emailAddressSignedCredential, phoneNumberCredential]
  const localCredentialsJSON = localCredentials.map(credential => credential.toJSON())

  // The api will change to take instances of the SignedCredential class as opposed to JSON encoded credentials
  const validCredentials = credentialRequest.applyConstraints(localCredentialsJSON)

  console.log(validCredentials) // [emailAddressSignedCredential]

Once the credential response has been assembled, it can be encoded and sent to the service's callback url:

.. code-block:: typescript

  const credentialResponseJWT  = credentialResponse.encode()

**Consume a Signed Credential Response**

Back to the service side! We have now received the credential response encoded as a ``JSON Web Token`` and can consume the provided data.
First, let's decode the response:

.. code-block:: typescript

  const credentialResponse = await JolocomLib.parse.interactionToken.fromJWT(receivedJWTEncodedResponse)
  await identityWallet.validateJWT(credentialResponse, credentialRequest)

.. note:: The ``validate`` method will ensure the response contains a valid signature, is not expired, lists our 
  ``did`` in the ``aud`` [audience] section, and contains the same ``jti`` [nonce] as the request.

Now that we have the decoded credential response, let's ensure that the user passed the credentials we requested:

.. code-block:: typescript

  /**
   * We check against the request we created in a previous step
   * this requires the server to be stateful. We are currently
   * expolring alternatives.
   */

  const validResponse = credentialResponse.satisfiesRequest(credentialRequest)
  const registry = JolocomLib.registries.jolocom.create()

  if (!validResponse) {
    throw new Error('Incorrect response received')
  }

  const providedCredentials = credentialResponse.getSuppliedCredentials()

  /** Eventually a helper will be provided to take care of this */
  const signatureValidationResults = await Promise.all(providedCredentials.map(credential => registry.validateSignature(credential)))

  if (signatureValidationResults.every(result => result === true)) {
    // The credentials can be used
  }

What next?
###########

Now that we understand the reasoning behind the credential request and response flows, it's time to test them out in action!
Head to the next section to learn how to set up your own service so it can interact with Jolocom identities.
