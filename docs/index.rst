.. Jolocom-Lib documentation master file, created by
   sphinx-quickstart on Fri Jun 29 15:59:46 2018.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

The Jolocom Protocol - Own Your Digital Self
============================================
**Our Approach**


The Jolocom Protocol is a lightweight protocol which enables self-sovereign identity, which is built 
with W3C open standards on top of Ethereum and IPFS. The architecture of the protocol revolves around
three main concepts: 

* Pairwise pseudonymous multiple personas
* Decentralized Identifiers (DIDs) and DID Documents
* Verifiable Credentials

Identities in the Jolocom system are controlled through asymmetric, public/private key cryptography. 
This provides identities with signing and transaction capabilities, as well as enabling context-specific interactions 
through child key pairs, which are derived as Hierarchical Deterministic Keys following the BIP-32 specification.

DIDs are globally unique, persistent identifiers associated with each key pair, which are self-issued and can be 
automatically resolved to DidDocuments containing more information about the identifier in question. 
Verifiable Credentials enable cryptographically verifiable statements about identities. As long as the consumer 
of the credential trusts the issuer of the statement, the Jolocom protocol provides a secure framework for the creation 
and transaction of trustable statements.

In its most simplistic form, the Jolocom Protocol can be used to:

* Create a self-sovereign identity for humans/devices/organizations
* Attach meaningful information to identities in the form of verifiable credentials
* Easily request and consume verified information about identities



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
  protocolComponents
