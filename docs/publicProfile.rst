Public Profile
===========================

.. note:: This section only applies to the `did:jolo <https://github.com/jolocom/jolo-did-method>`_ did method, or other DID mehtod implementations with a defined `publishPublicProfile <https://github.com/jolocom/jolo-did-method/blob/master/packages/jolo-did-registrar/ts/index.ts#L70>`_ method.

A public profile can be attached to an identity to make it easy for any identity with which you interact to easily resolve your identity. This is especially relevant for interactions with online services,
as a public profile can be used to advertise interaction conditions, as well as various attestations.

Before you start, be sure to initialize the ``IdentityWallet`` class as outlined in the `Getting Started <https://jolocom-lib.readthedocs.io/en/latest/gettingStarted.html#how-to-create-a-self-sovereign-identity>`_ section.

Adding a public profile
########################

We currently model public profiles as simple ``SignedCredential`` instances, each containing the following claims:
``about``, ``url``, ``image``, and ``name``.

Before we can publish the credential, we need to first create it:

.. code-block:: typescript

  import { claimsMetadata } from 'jolocom-lib'

  const myPublicProfile = {
    name: 'Jolocom',
    about: 'We enable a global identity system'
  }

  const publicProfileCredential = await identityWallet.create.signedCredential({
    metadata: claimsMetadata.publicProfile,
    claim: myPublicProfile,
    subject: identityWallet.did
  }, password)

Add the newly created public profile to your identity:

.. code-block:: typescript

  JolocomLib.didMethods.jolo.registrar.updatePublicProfile(
    softwareKeyProvider,
    password,
    identityWallet.identity,
    publicProfileCredential
  ).then(successful => console.log(successful)) // true

At this point, the public profile will be published / advertised as defined by the employed DID method instance.

Removing your public profile
#############################

.. code-block:: typescript

  identityWallet.identity.publicProfile = undefined
  
  JolocomLib.didMethods.jolo.registrar.update({
    identityWallet.didDocument,
    softwareKeyProvider,
    password
  }).then(successful => console.log(succesful)) // true

Please note that due to the way that IPFS handles the concept of deletion, this delete method simply unpins your public profile from its corresponding pin set, and allows the unpinned data
to be removed by the "garbage collection” process. Accordingly, if the data has been pinned by another IPFS gateway, complete removal of stored information on the IPFS network cannot be ensured.

View the public profile
#########################
If the identity has an associated public profile credential, and the correct resolver is used (e.g. in this case ``JolocomLib.didMethods.jolo.resolver``), the ``Identity`` instance returned as a result of resolution will have the associated public profile field populated.

.. code-block:: typescript

  JolocomLib.didMethods.jolo.resolver.resolve(identityWallet.did).then(identity => {
    console.log(identity.publicProfile) // Should contain the previously published signed credentials
  })
