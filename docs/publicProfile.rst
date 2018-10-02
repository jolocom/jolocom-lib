Public Profile
===========================

You can attach a public profile to a signing key so that parties who interact with this identity are able to
access basic information about you. This is especially relevant for interactions with online services, 
as the public profile would effectively be the default initial information exchanged between two identities.


Before you start, initialize the IdentityWallet class as outlined in first section. 

Add
###


Get the default metadata from the Jolocom library.

.. code-block:: typescript

  import { claimsMetadata } from 'jolocom-lib'

  
  const pubProfileMetadata = claimsMetadata.publicProfile


The default metadata for public profile looks as follows and requires at least the
``name`` and ``about`` fields to be filled out. You can also add ``image`` and ``url``.

.. literalinclude:: ../ts/index.ts
  :language: typescript
  :lines: 63-75

Your public profile is essentially a signed credential which is associated with
your DID. Create the signed credential.

.. code-block:: typescript
  
  const myDID = identityWallet.getIdentity().getDID()

  const myPublicProfile = {
    
    id: myDID,
    
    name: 'Jolocom',
    
    about: 'We enable a global identity system'
  
  }

    
  const publicProfileCred = idnentityWallet.create.signedCredential({
   
    metadata: publicProfileMetadata,
   
    claim: myPublicProfile
  
  })

Now add the created public profile to your identity.

.. code-block:: typescript

  identityWallet.identity.publicProfile.add(publicProfileCred)

Up until now, you have been making the changes to your identity locally.
Now, you can commit the changes to IPFS and Ethereum.

.. code-block:: typescript
  
  await registry.commit({wallet: identityWallet, ethereumPrivateKey})

Update
######

The update functionality is very similar to the add functionality. The only difference is that on add, an error is thrown if a public profile already exists.

Delete
######

.. code-block:: typescript

  identityWallet.identity.publicProfile.delete()


  await registry.commit({wallet: identityWallet, ethereumPrivateKey})

Please note that due to the way that IPFS handles the concept of deletion, this delete method simply unpins your public profile from its corresponding pin set, and allows the unpinned data 
to be garbage collected in a 24 hour cycle. Accordingly, if the data has been pinned by another IPFS gateway, complete removal of stored information on the IPFS network cannot be ensured.

Get
###

.. code-block:: typescript

  const publicProfile = identityWallet.identity.publicProfile.get()