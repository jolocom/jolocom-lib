Credential Based Communication Flows
======================================

This section provides an overview of the interaction flows supported by the Jolocom Library.

.. note:: Most of these flows require an anchored Jolocom identity. If you did not yet create one, make sure to check the `getting started <https://jolocom-lib.readthedocs.io/en/latest/gettingStarted.html>`_ section first.

Create a Signed Credential Request
####################################

.. note:: Documentation on what ``constraints`` are, and how a service can be more atomic in it's requirements will be added shortly.
Many services require the user to provide certain information upon signing up.
The Jolocom library provides a simple way for services to present their requirements to authenticating users through defining and presenting what we call a credential request.
We will first look at how we can generate the aforementioned request.

**Create Signed Credential Request from Credential Request**

.. code-block:: typescript

  import { InteractionType } from './interactionFlows/types'

  // An instance of an identityWallet is required at this point

  const credentialRequest = await identityWallet.create.credentialRequestJSONWebToken({
    typ: InteractionType.CredentialRequest,
    credentialRequest: {
      callbackURL: 'http://example.com/myendpoint/', // Where should the client send the credentials?
      credentialRequirements: [{
        type: ['Credential', 'ProofOfEmailCredential'],
        constraints: []
      }]
    }
  })

  ...

The easiest way to make the created credential request consumable for client applications is to encode it
as a `JSON Web Token <https://jwt.io/introduction/>`_  that can be easily decoded and validated by the client.

In order to make the credential request consumable by the `Jolocom SmartWallet <https://github.com/jolocom/smartwallet-app>`_ we need to further
encode the JSON Web Token as a QR code that can be scanned by the wallet. You can encode the credentialRequest as follows:

.. code-block:: typescript

  ...

  // Will be deprecated in future releases in favor of more user friendly and intuitive ways to encoding data
  const jwtEncoded = credentialRequest.encode()
  const QREncoded = new SSO().JWTtoQR(jwtEncoded)

Consume a Signed Credential Request
#####################################

On the client side, we can decode the received credential request as follows:

.. code-block:: typescript

  import { JSONWebToken } from "./interactionFlows/JSONWebToken"

  const credentialRequest = await JSONWebToken.decode(receivedJWTEncodedRequest)

  credentialRequest.getRequestedCredentialTypes() // [ [ 'Credential', 'ProofOfEmailCredential' ] ]
  credentialRequest.getCallbackURL() // http://example.com/myendpoint/

.. note:: The signature on the JSON Web Token will be automatically verified when we call ``decode()``.

Create a Signed Credential Response
#####################################

On the client side, after we have received the credential request, we want to prepare and send a corresponding credential response.

.. code-block:: typescript

  // An instance of an identityWallet is required at this point
  
  const credentialResponse = identityWallet.create.credentialResponseJSONWebToken({
    typ: InteractionType.CredentialResponse,
    credentialResponse: {
      suppliedCredentials: [emailAddressSignedCredential] // Created in section 3.1
    }
 })

In this case, it so happens that the credential we supplied happens to match what the service requested.
In order to ensure that we don't accidently provide credentials that do not correspond to the service requirements,
we can use the following method to filter:

.. code-block:: typescript

  // We assume the client application has multiple credentials persisted in a local database
  const localCredentials = [emailAddressSignedCredential, phoneNumberCredential]
  const localCredentialsJSON = localCredentials.map(credential => credential.toJSON())

  // The api will change to take instances of the SignedCredential class as opposed to JSON encoded credentials
  const validCredentials = credentialRequest.applyConstraints(localCredentialsJSON)

  // validCredentials = [emailAddressSignedCredential]

Once the credential response has been assembled, it can be encoded and sent to the service's callback url:

.. code-block:: typescript

  // Created previously

  const credentialResponseJWT  = credentialResponse.encode()

Consume a Signed Credential Response
#####################################

Back to the service side! We have now received the JSON Web Token encoded credential response, and can consume the provided data.
First, let's decode the response:

.. code-block:: typescript

  import { JSONWebToken } from "./interactionFlows/JSONWebToken"

  const credentialResponse = await JSONWebToken.decode(receivedJWTEncodedResponse)
  ...

.. note:: The signature on the JSON Web Token will be automatically verified when we call ``decode()``.

Now that we have the decoded credential response, let's ensure that the user passed the credentials we requested:

.. code-block:: typescript

  ...

  // We check against the request we created in 5.1
  const validResponse = credentialResponse.satisfiesRequest(credentialRequest)
  const registry = JolocomLib.registry.jolocom.create()

  if (!validResponse) {
    throw new Error('Incorrect response received')
  }

  const providedCredentials = credentialResponse.getSuppliedCredentials()

  const signatureValidationResults = await Promise.all(providedCredentials.map(credential => registry.validateSignature(credential)))

  if (signatureValidationResults.every(result => result === true)) {
    // The credentials can be used
  }

What next?
###########

Now that we understand the reasoning behind the credential request and response flows, it's time to test them out in action!
Head to the next section to learn how to set up your own service so it can interact with Jolocom identities.
