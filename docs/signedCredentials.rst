Credentials & Signed Credentials
================================

The Jolocom library contains a number of functions and classes that enable the creation and consumption of signed `verifiable credentials <https://w3c.github.io/vc-data-model/>`_.
Any agent can ensure a given credential is valid by verifying that the associated cryptographic signature is correct and was generated using the expected private key.

Create a signed credential
##################################

The easiest way to create a signed credential is by using an instance of the ``IdentityWallet`` class. If you have yet not created an identity, check out the `Getting Started <https://jolocom-lib.readthedocs.io/en/latest/gettingStarted.html>`_ section.
If you have already created an identity, you can obtain an identity wallet by authenticating, as defined in `section 2.2 <https://jolocom-lib.readthedocs.io/en/latest/gettingStarted.html#using-the-identity>`_.

.. code-block:: typescript

  import { JolocomLib } from 'jolocom-lib'
  import { claimsMetadata } from 'cred-types-jolocom-core'

  const password = 'correct horse battery staple'

  const emailAddressSignedCredential = await identityWallet.create.signedCredential({
    metadata: claimsMetadata.emailAddress,
    claim: { email: 'example@example.com' }
    subject: identityWallet.did // Our own DID, referred to as a self-issued credential
  }, password)

  ...

Notice the ``JSON`` form of the newly created ``emailAddressSignedCredential`` is simply a `JSON-LD Verifiable credential <https://w3c.github.io/vc-data-model/>`_.
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

.. note:: All credential types the library supports by default are made available through the ``cred-types-jolocom-core`` ``npm`` package.
  Alternatively, you can check out the `GitHub repository <https://github.com/jolocom/cred-types-jolocom-demo>`_.

It's worth noting that in the aforementioned credential, the ``issuer``, the ``subject``, and the signature ``creator`` each share the same DID.
We refer to this type of credential as `self-signed` or `self-issued`.

To issue a credential to another entity, we simply need to specify the DID of the corresponding ``subject``:

.. code-block:: typescript

  const emailAddressSignedCredential = identityWallet.create.signedCredential({
    metadata: claimsMetadata.emailAddress,
    claim: { email: 'example@example.com' },
    subject: 'did:jolo:6d6f636b207375626a656374206469646d6f636b207375626a65637420646964'
  }, password)

Taking a look at the newly created credential, we can indeed see that the ``subject``, denoted by the ``claim.id`` key, is different:

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

Validate a signature on a signed credential
#############################################

Perhaps you would like to present the newly created signed credential to a service or some other entity with a Jolocom identity as part of an interaction. The (intended) recipient needs to be able to verify that the credential received is valid.
Validating a received credential proceeds as follows:

.. code-block:: typescript

  import { JolocomLib } from 'jolocom-lib'

  // The credential will often be received serialized in its JSON form.
  const receivedCredential = JolocomLib.parse.signedCredential(json)
  const valid = await JolocomLib.util.validateDigestable(receivedCredential)

The previous step amounts to resolving the DID document associated with the credential ``issuer`` by using the listed public keys to validate the credential signature.

If you already know the public key corresponding to the signing party, it is not necessary to resolve the DID document:

.. code-block:: typescript

  import { JolocomLib } from 'jolocom-lib'

  const receivedSignedCredential = JolocomLib.parse.signedCredential.fromJSON(received)
  const issuerPublicKey = Buffer.from('030d4792f4165a0a78f7c7d14c42f6f98decfa23d36e8378c30e4291711b31961f', 'hex')

  /**
     * Please note that this will NOT fail if the signer has marked the public key as compromised or invalid;
     * the signature is simply being verified, without checking against any external resources.
   */

  console.log(await JolocomLib.keyProvider.verifyDigestable(issuerPublicKey, signedCred)) // true

Working with custom credentials
################################

Users are free to define custom credential types. The number of types of interactions would be quite restricted if only types defined
by Jolocom could be used. The following sections delve into why you might want to define custom credentials,
and how to do so.

**Why would I want to define a custom credential type?**

Let's assume you want to use verifiable credentials for managing permissions inside your system. You might have one or more trusted
identities that issue access credentials to requesters deemed authentic. For these purposes, none of the credential types
we currently provide suffice.

Or consider this scenario: a bar that only allows adults of legal age on the premises. At a certain point, patrons must prove
they are over 18 years of age in order to order enter the establishment. Patrons could of course disclose their individual dates of birth,
but this is not optimal in light of the fact that more information is disclosed than required for the purposes of the interaction.

An alternative is to adopt an approach based on verifiable credentials. A trusted entity, such as a government authority,
could issue signed credentials to all citizens that request such a verification, i.e. an attestation stating that a citizen is of or over a certain age.
A citizen could later present such a credential when entering a bar.

This allows citizens to prove that they are allowed to gain entry to the bar, in a verifiable way, without disclosing any additional information.


**Defining custom metadata**

So far, when creating credentials, ``metadata`` provided by the
``cred-types-jolocom-core`` package has been used. When creating custom credentials, we have to write
our own ``metadata`` definitions.

Let's take another look at the second example use case from the previous section. One of the many possible ``metadata`` definitions would be:

.. code-block:: typescript

  const customMetadata = {
    context: [{
      ageOver: 'https://ontology.example.com/v1#ageOver'
      ProofOfAgeOverCredential: 'https://ontology.example.com/v1#ProofOfAgeOverCredential'
    }],
    name: 'Age Over',
    type: ['Credential', 'ProofOfAgeOverCredential']
    claimInterface: {
      ageOver: 0
    } as { ageOver: number }
  }

.. note:: For more documentation on defining custom credential ``meatadata``, check out `this document <https://gist.github.com/Exulansis/bec3906fba96a8b63040bad918eec548>`_.
  Please note that all examples of **creating credentials** and **creating metadata** are currently outdated (updates already in progress).

The extra typing information - ``as {ageOver: number}`` is only relevant if you use TypeScript. It enables
for auto-completion on the ``claim`` section when creating a ``SignedCredential`` of this type.
If you develope in JavaScript, remove this line.

**Creating and verifying custom credentials**

The newly created ``metadata`` definition can now be used to create a credential:

.. code-block:: typescript

  const ageOverCredential = verifierIdentityWallet.create.signedCredential({
    metadata: customMetadata,
    claim: {
      ageOver: 18
    },
    subject: requesterDid
  }, servicePassword)

(It's that simple!)

It is worth noting that the custom ``metadata`` definition is only needed for creating
credentials. Validating custom credentials is still as simple as:

.. code-block:: typescript

  const valid = await JolocomLib.util.validateDigestable(ageOverCredential)
