Credentials & Signed Credentials
================================

The Jolocom library exposes a number of functions and classess that allow the creation and consumption of signed `verifiable credentials <https://w3c.github.io/vc-data-model/>`_.
Any agent can ensure a credential is valid by verifying that the associated cryptographic signature is correct and was generated using the expected private key.

Create a Signed Credential
##################################

The easiest way to create a signed credential, is by using an instance of the ``IdentityWallet`` class. If you have yet not created an identity, check out the `getting started <https://jolocom-lib.readthedocs.io/en/latest/gettingStarted.html>`_ section.
If you have already created an identity, you can obtain an identity wallet by authenticating, as defined in section `TODO`.

.. code-block:: typescript

  import { JolocomLib } from 'jolocom-lib'
  import { claimsMetadata } from 'cred-types-jolocom-core'

  const emailAddressSignedCredential = await identityWallet.create.signedCredential({
    metadata: claimsMetadata.emailAddress,
    claim: { email: 'example@example.com' }
    subject: identityWallet.did // Our own did, referred to as a self issued credential
  })

  ...

If we look at the ``JSON`` form of the newly created ``emailAddressSignedCredential``, we notice it's nothing but a `JSON-LD W3C Verifiable credential <https://w3c.github.io/vc-data-model/>`_.
The ``SignedCredential`` class provides a number of methods to easily consume the data from the credential.

.. code-block:: typescript

  // The credential in JSON form

  {
    @context: [
      {
        id: '@id',
        type: '@type',
        cred: 'https://w3id.org/credentials#',
        ...
        ProofOfEmailCredential: 'https://identity.jolocom.com/terms/ProofOfEmailCredential',
        schema: 'http://schema.org/',
        email: 'schema:email'
      }
    ],
    id: 'claimId:d9f45722872b7',
    name: 'Email address',
    issuer: 'did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777',
    issued: '2018-11-16T22:21:28.862Z',
    type: ['Credential', 'ProofOfEmailCredential'],
    expires: '2019-11-16T22:21:28.862Z',
    claim: {
      email: 'example@example.com',
      id: 'did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777'
    },
    proof: {
      created: '2018-11-16T22:21:28.861Z',
      type: 'EcdsaKoblitzSignature2016',
      nonce: 'fac9b5937e6f0cbb',
      signatureValue: '922c73134cb81558b337a0b222fac3c7f8418ca46febcd57d903def7134843640644f0086d36a6cf29f975b82eabfa45920ae8f663bca3f334ba19d527e1841e',
      creator: 'did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1'
    }
  }

.. note:: For more information on what types of credentials are supported by the Jolocom library by default,
  the purpose behind the ``claimsMetadata``,  the creation of custom credentials, and a deeper dive into the JSON-LD format, please refer to `this document <https://gist.github.com/Exulansis/bec3906fba96a8b63040bad918eec548>`_.

It's worth pointing out that in the aforementioned credential, the ``issuer``, ``subject``, and the signature ``creator`` are the same ``did``.
We refer to this type of credentials as `self signed` or `self issued`.

To issue a credential to another entity, we simply need to specify the corresponding ``subject`` ``did``:

.. code-block:: typescript

  const emailAddressSignedCredential = identityWallet.create.signedCredential({
    metadata: claimsMetadata.emailAddress,
    claim: { email: 'example@example.com' },
    subject: 'did:jolo:6d6f636b207375626a656374206469646d6f636b207375626a65637420646964'
  })

If we view the newly created credential, we can indeed observe that the ``subject``, denoted by the ``claim.id`` key, is different:

.. code-block:: typescript

  // The credential in JSON form
  // All irrelevant / repeating fields have been ommited.
  
  {
    '@context': [ ... ],
    ...
    issuer: 'did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777',
    claim: { 
      email: 'example@example.com',
      id: 'did:jolo:6d6f636b207375626a656374206469646d6f636b207375626a65637420646964'
    },
    proof: EcdsaLinkedDataSignature {
      ...
      creator: 'did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1'
      ...
  }

Validate signatures on a Signed Credentials
#############################################

Now that we have created a signed credential, we might want to present it to a service, or another identity as part of an interaction. The receiver needs to be able to ensure the credential is valid and authentic.
Validating a received credential looks as follows:

.. code-block:: typescript

  import { JolocomLib } from 'jolocom-lib'

  const registry = Jolocom.registry.jolocom.create()

  // Often times, on the credential will be received serialised as JSON.

  const registry = JolocomLib.registries.jolocom.create()
  const receivedCredential = JolocomLib.parse.signedCredential(json)

  const issuerIdentity = await registry.resolve(receivedCredential.issuer)
  const issuerPublicKey = getIssuerPublicKey(receivedCredential.signer.keyId, issuerIdentity.didDocument)
  console.log(await JolocomLib.keyProvider.verifyDigestable(issuerPublicKey, signedCred)) // true

.. note:: Currently the process of fetching the issuer's public key for signature validation is slightly cumbersome, we are
  working on it, and will focus on improving this part of the api for the next release.

In the previous step, we are essentially resolving the ``did`` document associated with the credential ``issuer``, and use the listed public
keys to validate the credential signature.

If you know the public key of the signing party beforehand, the identity resolution part can of course be skipped:

.. code-block:: typescript

  import { JolocomLib } from 'jolocom-lib'

  const receivedSignedCredential = JolocomLib.parse.signedCredential.fromJSON(received)
  const issuerPublicKey = Buffer.from('030d4792f4165a0a78f7c7d14c42f6f98decfa23d36e8378c30e4291711b31961f', 'hex')

  /** 
   * Please note that this will not fail if the signer has marked the public key as compromised or invalid,
   * we are simply verifying the signature without checking any external resources
   */

  console.log(await JolocomLib.keyProvider.verifyDigestable(issuerPublicKey, signedCred)) // true