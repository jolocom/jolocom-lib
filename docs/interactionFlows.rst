Credential-based Communication Flows
======================================

This section offers a detailed overview of the interaction flows supported by the Jolocom Library.

Identities can interact in incredibly complex ways. We currently support a number of quite
simple interaction flows, and intend to greatly expand the list in future releases.

.. note:: The following sections assume you have already created an identity. If youhave not yet created an identity, check out the `Getting Started <https://jolocom-lib.readthedocs.io/en/latest/gettingStarted.html>`_ section.

Request credentials from another identity
##########################################

Many services require their users to provide certain information upon signing up.
The Jolocom library provides a simple way for services to present their requirements to users who wish to authenticate through defining and presenting what we call a credential request.
First, the aforementioned request must be generated:

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

.. note:: Documentation on ``constraints`` and how they can be used to create even more specific
  constraints will be added soon.

.. note:: For further documentation and examples explaining how to create and send
 credential requests, check the `API documentation <https://htmlpreview.github.io/?https://raw.githubusercontent.com/jolocom/jolocom-lib/master/api_docs/documentation/classes/credentialrequest.html>`_,
 the `demo service implementation <https://github.com/jolocom/demo-sso>`_, the `integration tests <https://github.com/jolocom/jolocom-lib/tree/master/tests/integration>`_, and finally `this collection of examples <https://github.com/Exulansis/Validation-Examples>`_.

The easiest way to make the credential request consumable for the client applications is to encode it
as a `JSON Web Token <https://jwt.io/introduction/>`_. This allows us to easily validate signatures on individual messages, and prevent some replay attacks.

In order to make the credential request consumable by the `Jolocom SmartWallet <https://github.com/jolocom/smartwallet-app>`_ the ``JSON Web Token`` must further
be encoded as a QR code that can be scanned by the wallet application. The ``credentialRequest`` can be encoded as follows:

.. code-block:: typescript

  // Will be deprecated in future releases in favor of more user-friendly and intuitive ways to encode data

  const jwtEncoded = credentialRequest.encode()
  const QREncoded = new SSO().JWTtoQR(jwtEncoded)

Further encodings will be added as the architecture continues to mature.

**Consume a Signed Credential Request**

Once the encoded credential request has been received on the client side, a corresponding credential response should be prepared and sent:

.. code-block:: typescript

  const credentialRequest = JolocomLib.parse.interactionToken.fromJWT(enc)
  identityWallet.validateJWT(credentialRequest)

.. note:: The ``validateJWT`` method will ensure the credential is not expired, and that it contains a valid signature.


**Create a Credential Response**

Once the request has been decoded, we can create the response:

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

The credential supplied above (conveniently) matches what the service requested.
To ensure that no credentials other than those corresponding to the service requirements are provided,
the following method to filter can be used:

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

Back to the service side! The credential response encoded as a ``JSON Web Token`` has been received and the provided data is ready to consume.
First, decode the response:

.. code-block:: typescript

  const credentialResponse = await JolocomLib.parse.interactionToken.fromJWT(receivedJWTEncodedResponse)
  await identityWallet.validateJWT(credentialResponse, credentialRequest)

.. note:: The ``validate`` method will ensure the response contains a valid signature, is not expired, lists our
 DID in the ``aud`` [audience] section, and contains the same ``jti`` [nonce] as the request.

After decoding the credential response, verify that the user passed the credentials specified in the request:

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


Offering credentials to another identity [EXPERIMENTAL]
########################################################

In some cases, an agent might want to issue another agent a signed credential. We are currently
developing a simple protocol to facilitate this interaction. As of now, an early version is 
already supported through the Jolocom Library.

**Create a Credential Offer**

A Credential offer manifest functions as a menu of credentials which can be issued by the agent who created it.
It's basic units are individual Credential offers which contain metadata about the credentials offered, for example:

.. code-block:: typescript

   const emailOffer: CredentialOffer = {
     type: 'email'
   }
   const phoneNumberOffer: CredentialOffer = {
     type: 'phoneNumber'
   }

Next, the agent offering the attestation must create a credential offer:

.. code-block:: typescript

  const credentialOffer = await identityWallet.create.interactionTokens.request.offer({
    callbackURL: 'https://example.com/receive/...',
    offeredCredentials: [emailOffer, phoneNumberOffer]
  })

The endpoint denoted by the ``callbackURL`` key will be pinged by the client device with 
a response to the offer.

The CredentialOffer objects may also contain additional information in the form of ``requestedInput``,
``renderInfo`` and ``metadata`` (which currently supports only a boolean ``asynchronous`` key).

The ``metadata.asynchronous`` (will be used to signal if the credential will be available right away) and 
``requestedInput`` (will be used for requesting additional information, e.g. a valid id card to receive
a driver license credential) are not used as of now, and will be supported once we
implement verification requests.

The ``renderInfo`` is used to describe how a credential should be rendered and is currently supported
by the Jolocom Smartwallet. It allows for a variety of graphical descriptors in it's format:

.. code-block:: typescript
  enum CredentialRenderTypes {
    document = 'document',
    permission = 'permission',
    claim = 'claim',
  }
  export interface CredentialOfferRenderInfo {
    renderAs?: CredentialRenderTypes
    background?: {
      color?: string // Hex value
      url?: string // URL to base64 encoded background image
    }
    logo?: {
      url: string // URL to base64 encoded image
    }
    text?: {
      color: string // Hex value
    }
  }

As an example, we could define a display format for our email credential offer with:

.. code-block:: typescript
  const emailOffer: CredentialOffer = {
    type: 'email',
    renderInfo: {
      renderAs: 'document',
      background: {
        url: 'https://url.for.your/image.png'
      }
      logo: {
        url: 'https://logo.url/for/email'
      }
      text: {
        color: 'blue'
      }
    }
  }

**Consume a Credential Offer**

On the client side, we can decode and validate the received credential request as follows:

.. code-block:: typescript

  const credentialOffer = JolocomLib.parse.interactionToken.fromJWT(enc)
  identityWallet.validateJWT(credentialRequest)

.. note:: The ``validateJWT`` method will ensure the credential is not expired, and that it contains a valid signature.

**Create a Credential Offer Response**

To create a response for a credential offer, the callbackURL and the selected credentials must be used:

.. code-block:: typescript

  const offerResponse = await identityWallet.create.interactionTokens.response.offer({
    callbackURL: credentialOffer.callbackURL,
    selectedCredentials: [
      {
        type: 'email'
      },
      {
        type: 'phoneNumber'
      }
    ]
  }, secret, credentialOffer)

.. note:: The response simply replays all fields in the response. With the introduction of verification requests
  this will no longer be the case.

**Transferring the credential to the user**

The credential offer response is sent back to the service, which in return generates the credential and
sends it to the client. There are a few way to accomplish the last step, currently the service simply
issues a ``CredentialResponse`` JWT containing the credentials. An example implementation can be found `here <https://github.com/jolocom/demo-sso/blob/master/server/routes.ts>`_.

What next?
###########

With the reasoning behind the credential request and response flows unpacked, it's time to put it all to the test!
Head to the next section to learn how to set up your own service for interacting with Jolocom identities.
