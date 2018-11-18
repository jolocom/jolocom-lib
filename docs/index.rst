.. Jolocom-Lib documentation master file, created by
   sphinx-quickstart on Fri Jun 29 15:59:46 2018.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

The Jolocom Protocol - Own Your Digital Self
============================================
**Our Approach**


The Jolocom protocol is a universal, lightweight, open source protocol for decentralized digital identity and access right management.

Any individual, organization, or smart agent ought to be able to use our decentralized protocol to create and share information about their identity in a digital format that can be communicated over a network. 

The protocol is built according to leading industry standards and implements blockchain and other decentralized technologies.


The protcol architecture revolves around three main concepts:

* `Hierarchical Deterministic Key Derivation <https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki>`_ , which enables pseudonymous, context-specific interactions through the creation of and control over multiple identities.

* `Decentralized Identifiers (DIDs)<https://w3c-ccg.github.io/did-spec/>`_ , which are associated with each identity and used during most interaction flows, such as authentication or data exchange.

* `Verifiable Credentials <https://w3c.github.io/vc-data-model/>`_ , which are digitally-signed attestations issued by an identity. The specification can be used to develop a simple way of associating attribute information with identifiers.


Cryptographic keys and DIDs enable the existence of a self-sovereign identity. Keys and verifiable credentials provide the tools required to create complex data while simultaneously preserving simplicity at the core.

This approach allows us to keep the protocol generic while facilitating an unlimited number of specific use cases with varying levels of complexity.

A further component of the protocol architecture calls for the integration of a public, censorship-resistant, decentralized network for anchoring and resolving user identifiers. For this we currently use IPFS for storage and Ethereum for anchoring and indexing identifiers.

In its most simplistic form, the Jolocom protocol can be used to:

* Create a self-sovereign identity for use by humans, organisations, and smart agents;
* Attach meaningful information to identities in the form of verifiable credentials;
* Easily request and consume verified information about identities in an automated fashoin.

We hope it will serve efforts to decentralize the web and digital identity, and enable people, organisations, and smart agents to own and control the data that defines them.


.. toctree::
  :maxdepth: 4
  :numbered:
  :caption: Where to go next?

  introduction
  gettingStarted
  signedCredentials
  publicProfile
  interactionFlows
  ssoSetUp
  customConnectors
