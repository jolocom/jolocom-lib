Introduction
============

This section provides a very brief overview of the protocol architecture, introduces the concept of self-sovereign identity,
and explains how to navigate the Jolocom library.

.. image:: overview.jpg

**System Architecture**

The Jolocom protocol is built using the following core specifications:

* `Hierarchical Deterministic Key Derivation <https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki>`_ , which enables pseudonymous, context-specific interactions through the creation of and control over multiple identities.

* `Decentralized Identifiers (DIDs) <https://w3c-ccg.github.io/did-spec/>`_ , which are associated with each identity and used during most interaction flows, such as authentication or data exchange.

* `Verifiable Credentials <https://w3c.github.io/vc-data-model/>`_ , which are digitally-signed attestations issued by an identity. The specification can be used to develop a simple way of associating attribute information with identifiers.

A further component of the protocol architecture calls for the integration of a public, censorship-resistant, decentralized network for anchoring and resolving user identifiers. For this we currently use IPFS for storage and Ethereum for anchoring and indexing identifiers.


.. warning:: Please be aware that the Jolocom library is still undergoing active develpoment. All identities are currently anchored on the Rinkeby testnet.

  Please do not transfer any real ether to your Jolocom identity.

The Jolocom library at a glance
################################

The Jolocom library exposes an interface with four main entry points:

- ``identityManager`` - used for generating, deriving, and managing multiple keys;
- ``parse`` - used for instantiating various classess offered by the Jolocom library from encoded / serialized forms;
- ``registry`` - used for adding, retrieving, and modifying data persisted on IPFS and indexed on Ethereum;
- ``unsigned`` - used for generating unsigned versions of various data structures offered by the Jolocom library.

The next section examines the API in more detail.