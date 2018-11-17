Introduction
============

This section provides a brief overview of the protocol architecture, an introductory understanding on how to 
navigate the Jolocom library, as well as some context on the concept of self-sovereign identity.

.. image:: overview.jpg

**System Architecture**

The Jolocom protocol is build using the following core components:

* `Hierarchical Deterministic Key Derivation <https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki>`_ enables pseudonymous, context specific interactions through the creation of and control over multiple identities.

* `Decentralized Identifiers <https://w3c-ccg.github.io/did-spec/>`_ (DIDs) are associated with each identity and used during most interaction flows explore later, such as authentication or data exchange.

* `Verifiable Credentials <https://w3c.github.io/vc-data-model/>`_ are digitally signed attestations issued by an identity. The specification ca be used to develop a simple way of associating attribute information with identifiers.

* A public, censorship resistent, decentralized network for anchoring and resolving user identifiers, (currently IPFS for storage, and Ethereum for aiding resolution)


.. warning:: Please be aware that the Jolocom library is still in early stages, we are currently anchoring all identities on the Rinkeby testnet.

  Please do not transfer any real ether to your Jolocom identity.

The Jolocom Library at a Glance
################################

The Jolocom library exposes an interface with four main entry points:

- ``identityManager`` - used for generating, deriving, and managing multiple keys.
- ``parse`` - used for instantiating various classess offered by the Jolocom library from encoded / serialized forms.
- ``registry`` - used for adding, retrieving, and modifying data persisted on IPFS and indexed on Ethereum.
- ``unsigned`` - used for generating unsigned versions of various datastructures offered by the Jolocom library.

As you explore through the next sections of the documentation, we will look at the individual sections of the api in more detail.