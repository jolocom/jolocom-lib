.. Jolocom-Lib documentation master file, created by
   sphinx-quickstart on Fri Jun 29 15:59:46 2018.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

The Jolocom Protocol - Own Your Digital Self
============================================
**Our Approach**


The Jolocom Protocol is a light weight level two protocol which is build on open standards
and sits on top of a blockchain implementation. The architecture of the protocol revolves around
three main concepts: 

* Cryptographic Keys
* Decentralized Identifiers (DIDs)
* Verifiable Credentials

Cryptographic keys enable context specific interactions and provide identities with signing and
transaction capabilities. DIDs enable globally unique identifiers which are self issued and can be
automatically resolved to DidDocuments containing more information about the identifier in question.
Verifiable Credentials build the third pillar of the protocol. They provide a way to express statements
about a subject which are cryptographically verifiable. This commoditizes the process of issuing and
consuming a trustable statement – leaving the consumer of a verifiable credential with only one task:
the choice to trust the issuer of the statement or not.

Pillar one and two enable the existence of a self sovereign identity. Pillar one and three provide the
needed tools to create complex structures on the edges while preserving protocol simplicity (at the core).
This approach allows Jolocom to keep the protocol generic while account for a vast amount of use cases with
varying complexity levels.

The usage of the Jolocom protocol manifests itself in the following main patterns:

* Create a self sovereign identity for humans/devices/organizations
* Attach meaningful information to identities in the form of verifiable credentials
* Easily request and consume verified information about identities



.. toctree::
  :maxdepth: 4
  :caption: Where to go next?

  introduction
  gettingStarted
  usage
  ssoSetUp
  protocolComponents
