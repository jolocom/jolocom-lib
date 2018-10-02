================================
Credentials & Signed Credentials
================================

Using the Jolocom library, each identity can issue verifiable credentials to other identities, and to itself.
A verifiable credential is a digitally signed JSON-LD document containing various claims about other identities.
Any agent can ensure a credential is valid by verifying that the associated digital signature was created using the issuer's private key.

Create a Signed Credential
##################################

In order to create a signed credential, we need an instance of an ``identityWallet``. We can create a new one as defined in the `Getting Started <https://jolocom-lib.readthedocs.io/en/latest/gettingStarted.html>`_ section.

In case you've already created an identity, you can get an instance of an ``identityWallet`` as follows:

.. code-block:: typescript

  import { JolocomLib } from 'jolocom-lib'
  import { privIdentityKeyHex } from '..'
  import { claimsMetadata } from 'cred-types-jolocom-core'

  const registry = Jolocom.registry.jolocom.create()

  const identityWallet = await registry.authenticate(Buffer.from(privIdentityKeyHex, 'hex'))

  const emailAddressSignedCredential = identityWallet.create.signedCredential({
    metadata: claimsMetadata.emailAddress,
    claim: { email: 'example@example.com' }
  })

  ...

If we look at the credential we created, we notice it essentially is an instance of a class wrapping a `JSON-LD W3C Verifiable credential <https://w3c.github.io/vc-data-model/>`_.
The class provides a number of useful methods for altering and consuming the credential.

.. code-block:: typescript

  ...

  console.log(emailAddressSignedCredential)

  // SignedCredential {
  //   '@context':
  //     ['https://w3id.org/identity/v1',
  //       { proof: 'https://w3id.org/security#proof' },
  //       {
  //         ProofOfEmailCredential: 'https://identity.jolocom.com/terms/ProofOfEmailCredential',
  //         schema: 'http://schema.org/',
  //         email: 'schema:email'
  //       }],
  //   type: ['Credential', 'ProofOfEmailCredential'],
  //   name: 'Email address',
  //   id: 'claimId:2952f9751c68f',
  //   issued: 2018 - 10 - 02T10: 21: 41.288Z,
  //   issuer: 'did:jolo:b310d293aeac8a5ca680232b96901fe85988fde2860a1a5db69b49762923cc88',
  //   claim: {
  //     email: 'example@jolocom.com',
  //     id: 'did:jolo:b310d293aeac8a5ca680232b96901fe85988fde2860a1a5db69b49762923cc88'
  //   },
  //   proof: EcdsaLinkedDataSignature {
  //     type: 'EcdsaKoblitzSignature2016',
  //     created: 2018 - 10 - 02T10: 21: 41.288Z,
  //     creator: 'did:jolo:b310d293aeac8a5ca680232b96901fe85988fde2860a1a5db69b49762923cc88#keys-1',
  //     nonce: 'cacaf6776e733',
  //     signatureValue: 'JIx7aSGu27cBmul+7dGafSN1PPQS3UDixVwPRKXkSaN733jKKGykSV/RDMcCXR7ai+o40C9ESroXu5ZWo0sYTQ=='
  //   }
  // }

.. note:: For more information on what types of credentials are supported by the Jolocom library by default,
  the purpose behind the ``claimsMetadata``,  the creation of custom credentials, and a deeper dive into the JSON-LD format, please refer to `this resource <https://gist.github.com/Exulansis/bec3906fba96a8b63040bad918eec548>`_

It's worth pointing out that in the aforementioned credential, the ``issuer``, "subject", and signature ``creator`` are the same.
We refer to this type of credentials as "self signed" or "self issued".

If you want to issue a credential about a different identity, you need to provide the "subject" DID as follows:

.. code-block:: typescript

  //we use the identiyWallet created in the previous step

  const emailAddressSignedCredential = identityWallet.create.signedCredential({
    metadata: claimsMetadata.emailAddress,
    claim: { email: 'example@example.com' },
    subject: 'did:jolo:6d6f636b207375626a656374206469646d6f636b207375626a65637420646964'
  })

If we view the newly created credential, we can indeed observe that the "subject", denoted by the ``claim.id`` is different:

.. code-block:: typescript

  console.log(emailAddressSignedCredential)

  // All irrelevant / repeating fields have been ommited.
  //
  //  SignedCredential {
  //    '@context': [ ... ],
  //    ...
  //    issuer: 'did:jolo:b310d293aeac8a5ca680232b96901fe85988fde2860a1a5db69b49762923cc88',
  //    claim: { 
  //      email: 'example@jolocom.com',
  //      id: 'did:jolo:6d6f636b207375626a656374206469646d6f636b207375626a65637420646964'
  //    },
  //    proof: EcdsaLinkedDataSignature {
  //      ...
  //      creator: 'did:jolo:b310d293aeac8a5ca680232b96901fe85988fde2860a1a5db69b49762923cc88#keys-1',
  //      ...
  //    }

Validate the signature on a Signed Credential
#############################################

Now that we have created a signed, we might want to present it to a service, or another identity. The receiver can then validate the signature on the credential.
The simplest way to validate a signature, is to instantiate a new ``registry`` as described in `"Getting Started" <https://jolocom-lib.readthedocs.io/en/latest/gettingStarted.html>`_ section, and call the associated ``validateSignature`` method:

.. code-block:: typescript

  import { JolocomLib } from 'jolocom-lib'

  const registry = Jolocom.registry.jolocom.create()

  // Often times, on the receiving side, we will be sent the credential encoded as JSON
  // In this case we will need to create an instance of the SignedCredential class first

  const receivedSignedCredential = JolocomLib.parse.signedCredential.fromJSON(received)
  const valid = await reg.validateSignature(emailAddressSignedCredential) // true

During this operation, the DID document associated with the signer's DID will be resolved,
including the associated public keys. Once we have a list of the signer's public keys, we can verify the signature.

If you know the public key of the signing party beforehand, you can attempt to validate the signature directly:

.. code-block:: typescript

  import { JolocomLib } from 'jolocom-lib'
  const signerPubKey = Buffer.from('030d4792f4165a0a78f7c7d14c42f6f98decfa23d36e8378c30e4291711b31961f', 'hex')

  const receivedSignedCredential = JolocomLib.parse.signedCredential.fromJSON(received)

  // Please note that this will not fail if the signer has invalidated the public key by removing it from their DID document.
  const valid = await signedCred.validateSignatureWithPublicKey(signerPubKey)

Creating a credential for signing
##################################

In certain cases, it might make sense to assemble a non-signed credential first, and send it another entity for signing.
This might be useful if you want the signing to happen on another device that holds the relevant private keys.
In order to accomplish this, we first need to create a credential:

.. code-block:: typescript

  const unsignedCredential = JolocomLib.unsigned.createCredential({
    metadata: claimsMetadata.emailAddress,
    claim: { email: 'example@example.com' },
    subject: 'did:jolo:6d6f636b207375626a656374206469646d6f636b207375626a65637420646964'
  })

  // Serialise for serialize to the other party
  const toSendToOtherParty = usignedCredential.toJSON()

On the receiving end, we can parse the received credential, and sign it as follows:

.. code-block:: typescript

  import { JolocomLib } from 'jolocom-lib'

  const unsignedCredential = JolocomLib.parse.credential.fromJSON(receivedFromOtherParty)
  const signed = await iw.sign.credential(cr)
  const toSendToOtherParty = signed.toJSON()

.. warning:: Please note that in this flow, the issuer of the credential will be set to the signer.