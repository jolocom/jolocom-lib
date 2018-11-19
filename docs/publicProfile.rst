Public Profile
===========================

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

  const credential = await identityWallet.create.signedCredential({
    metadata: claimsMetadata.publicProfile,
    claim: myPublicProfile,
    subject: identityWallet.did
  }, password)

Add the newly created public profile to your identity:

.. code-block:: typescript

  /** 
  * Typescript accessors are used to get
  * and set values on the identityWallet instance
  * @see https://www.typescriptlang.org/docs/handbook/classes.html
  */

  identityWallet.publicProfile = publicProfileCred


.. note:: `Typescript accessors <https://www.typescriptlang.org/docs/handbook/classes.html>`_ are used to get and set values on the ``identityWallet`` instance

So far you have been making changes to your identity only locally.
Now, you can commit the changes to IPFS and Ethereum.

.. code-block:: typescript
  
  await registry.commit({
    identityWallet,
    vaultedKeyProvider,
    keyMetadata: {
      encryptionPass: secret,
      derivationPath: JolocomLib.KeyTypes.jolocomIdentityKey
    }
  })

In order to update your public profile, simply create a new credential, add it to your ``identityWallet``, and commit the changes.

Removing your public profile
#############################

.. code-block:: typescript

  identityWallet.identity.publicProfile = undefined
  
  await registry.commit({
    identityWallet,
    vaultedKeyProvider,
    keyMetadata: {
      encryptionPass: secret,
      derivationPath: JolocomLib.KeyTypes.jolocomIdentityKey
    }
  })

Please note that due to the way that IPFS handles the concept of deletion, this delete method simply unpins your public profile from its corresponding pin set, and allows the unpinned data
to be removed by the "garbage collection” process. Accordingly, if the data has been pinned by another IPFS gateway, complete removal of stored information on the IPFS network cannot be ensured.

View the public profile
#########################
Viewing the public profile associated with an identity is easy:

.. code-block:: typescript

  console.log(identityWallet.identity.publicProfile)

An instance of the ``SignedCredential`` class is returned.