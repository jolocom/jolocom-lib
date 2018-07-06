============
Introduction
============

This section gives you a brief overview of the protocol architecture, a fist understanding
on how to navigate the jolocom-lib and some context on what actually a self sovereign identity is.


.. image:: overview.jpg


**System Architecture**

The Jolocom protocol is build using the following core components:

* `Hierarchical Deterministic Key Derivation <https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki>`_ to allow for
  context specific interactions & different ledger usage while 
  preserving key manageability

* `Decentralized Identifiers <https://w3c-ccg.github.io/did-spec/>`_ (DIDs) to enable self-sovereign identity creation and management

* `Verifiable Credentials <https://w3c.github.io/vc-data-model/>`_ as a cryptographically consumable means to attach information to identities thus making them meaningful

* `JWT <https://jwt.io/>`_ as means to exchange credential requests and responses between identities


.. warning:: Please be aware that the jolocom-lib is work in progress. Also, we are currently using
  the Ethereum testnet Rinkeby. Please do not transfer any real ether to your created addresses.

**Interaction Flows Visualized**

Coming soon.



#########################
Jolocom-lib at One Glance
#########################

The jolocom-lib exposes a JolocomLib interface with four main entry points:

* parse
* registry
* identityManager
* unsigned

Verifiable Credentials and DID/DidDocuments are JSON-LD data types. 
The jolocom-lib exposes methods on respective classes to serialize and deserialize.

The parse functionality allows to parse ``fromJSON`` (JSON-LD) or ``fromJWT``.

The registry is used for registering the identity, performing any updates, and as the
resolution mechanism.


IdentityManagers' purpose is to create and manage your keys.

The unsigned functionality allows you to use the flows which do not require a private key.

The jolocom-lib also exposes claimsMetadata. Since the verifiable credentials are JSON-LD documents
you need to provide additional information besides the actual input.


In the case of an email address, the metadata would be:

.. literalinclude:: ../ts/index.ts
  :language: typescript
  :lines: 24-36

The actual email claim would be:

.. code-block:: typescript

  {
    
    id: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af'
    
    email: 'hello@jolocom.com'
  
  }

Jolocom-lib tries to incorporate heavy used credential types in order to make credential creation
as easy as possible.





##################################
What is a Self Sovereign Identity?
##################################

Coming soon.
