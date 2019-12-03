Credential-based Communication Flows
======================================

This section offers an overview of the interaction flows supported by the Jolocom Library.

Identities can interact in incredibly complex ways. We currently support a number of quite
simple interaction flows, and intend to greatly expand the list in future releases.

.. note:: The following sections assume you have already created an identity. If you have not yet created an identity, check out the `Getting Started <https://jolocom-lib.readthedocs.io/en/latest/gettingStarted.html>`_ section.

Credential requests
##########################################

Many services require their users to provide certain information upon signing up.
The Jolocom library provides a simple way for services to present their requirements to users who wish to authenticate through. This is done by creating and broadcasting what we refer to as a "Credential Request".
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

We also allow for simple constraints to be encoded as part of the credential request. If we want to communicate that only credentials issued by a particular ``did`` should be provided, we can do the following:

.. code-block:: typescript

  import {constraintFunctions} from 'jolocom-lib/js/interactionTokens/credentialRequest'

  // An instance of an identityWallet is required at this point
    const credentialRequest = await identityWallet.create.interactionTokens.request.share({
      callbackURL: 'https://example.com/authentication/',
      credentialRequirements: [{
          type: ['Credential', 'ProofOfEmailCredential'],
          constraints: [constraintFunctions.is('issuer', 'did:jolo:abc...')]
        }]
    },
    password)

By default the generated credential request will be valid for 1 hour. Attempting to scan or validate the requests after the expiry period
will fail. In case you would like to specify a custom expiry date, the following is supported:

.. code-block:: typescript

  // You can also pass a custom expiry date for the credential, supported since v3.1.0
  const customExpiryDate = new Date(2030, 1, 1)

  // An instance of an identityWallet is required at this point
    const credentialRequest = await identityWallet.create.interactionTokens.request.share({
      expires: customExpiryDate
      callbackURL: 'https://example.com/authentication/',
      credentialRequirements: [{
          type: ['Credential', 'ProofOfEmailCredential'],
          constraints: []
        }]
    },
    password)

.. note:: The expiration date can be passed in a similar manner when creating other interaction token types as well (e.g. Authentication, Credential Offer, etc...)

.. note:: For further documentation and examples explaining how to create and send
 credential requests, check the `API documentation <https://htmlpreview.github.io/?https://raw.githubusercontent.com/jolocom/jolocom-lib/master/api_docs/documentation/classes/credentialrequest.html>`_,
 the `generic backend documentation <https://github.com/jolocom/generic-backend>`_, the `integration tests <https://github.com/jolocom/jolocom-lib/tree/master/tests/integration>`_, and finally `this collection of simple snippets <https://github.com/Exulansis/jolocom_snippets>`_.

The easiest way to make the credential request consumable for the client applications is to encode it
as a `JSON Web Token <https://jwt.io/introduction/>`_. This allows us to easily validate signatures on individual messages, and prevent some replay attacks.

In order to make the credential request consumable by the `Jolocom SmartWallet <https://github.com/jolocom/smartwallet-app>`_ the ``JSON Web Token`` must further
be encoded as a QR code that can be scanned by the wallet application. The ``credentialRequest`` can be encoded as follows:

.. code-block:: typescript

  // Will be deprecated in future releases in favor of more user-friendly and intuitive ways to encode data

  const jwtEncoded = credentialRequest.encode()
  const QREncoded = new SSO().JWTtoQR(jwtEncoded)

.. note:: The ``JWT`` encoded interaction token can also be sent to the Jolocom SmartWallet via "Deep Links"..

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
 ``did`` in the ``aud`` (audience) section, and contains the same ``jti`` (nonce) as the request.

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

  const signatureValidationResults = await JolocomLib.util.validateDigestables(providedCredentials)

  if (signatureValidationResults.every(result => result === true)) {
    // The credentials can be used
  }


Credential issuance
########################################################

The Jolocom Library also allows for the issuance  of verifiable credentials. Similarly to the flow
outlined in the previous subsection, a "Credential Offer" needs to be created and broadcast.

**Create a Credential Offer**

Firstly, a credential offer needs to be created:

.. code-block:: typescript

  const credentialOffer = await identityWallet.create.interactionTokens.request.offer({
    callbackURL: 'https://example.com/receive/',
    offeredCredentials: [{
     type: 'idCard'
    }, {
     type: 'otherCredential'
    }]
  })

The endpoint denoted by the ``callbackURL`` key will be pinged by the client device with a response to the offer.

The CredentialOffer objects may also contain additional information in the form of ``requestedInput``,
``renderInfo`` and ``metadata`` (which currently supports only a boolean ``asynchronous`` key).

A more complex offer can be created as follows:

.. code-block:: typescript

  import {CredentialRenderTypes} from 'jolocom-lib/interactionTokens/interactionTokens.types'

  const idCardOffer: CredentialOffer = {
    type: 'idCard',
    renderInfo: {
      renderAs: CredentialRenderTypes.document,
      logo: {
        url: 'https://miro.medium.com/fit/c/240/240/1*jbb5WdcAvaY1uVdCjX1XVg.png'
      },
      background: {
        url: 'https://i.imgur.com/0Mrldei.png',
      },
      text: {
        color: '#05050d'
      }
    }
    metadata: {
      asynchronous: false // Is the credential available right away?
    },
    requestedInput: {} // What is required to receive the credential, e.g. residence permit credential, etc.
    }
  }

.. note:: The ``metadata.asynchronous`` and ``requestedInput`` keys are not currently used, and act as placeholders. We are awaiting further standardisation efforts.
    An example of such standardisation initiatives is the `Credential Manifest <https://github.com/decentralized-identity/credential-manifest/blob/master/explainer.md>`_ proposal.

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
        type: 'idCard'
      },
      {
        type: 'otherCredential'
      }
    ]
  }, secret, credentialOffer)

.. note:: The structure of the response will change as we add support for the aforementioned ``requestedInput`` field.

**Transferring the credential to the user**

The credential offer response is sent back to the ``callbackURL`` provided by the service. At this point, the service can generate the credentials and transfer them to the user.
There are a few way to accomplish the last step, currently the service simply issues a ``CredentialResponse`` JWT containing the credentials.
We intend to use `Verifiable Presentations <https://w3c.github.io/vc-data-model/#presentations-0>`_ for this step once the specification matures.

An example implementation for an issuance service can be found `here <https://github.com/jolocom/generic-backend>`_.

What next?
###########

Some additional bits of high level documentation related to the supported interaction flows are available `here <https://jolocom.slite.com/api/s/note/KwPQEd2dvZkBE4C6MfZoQR/Interaction-Tokens>`_

With the reasoning behind the credential request and response flows unpacked, it's time to put it all to the test!
Head to the next section to learn how to set up your own service for interacting with Jolocom identities.
