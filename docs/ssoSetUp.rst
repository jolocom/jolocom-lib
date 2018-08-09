=================================
Single Sign On (SSO) with Jolocom
=================================

This section shows how to implement a single sign on with the Jolocom library.
This can be relevant for services, dApp developers, etc.



########################################
Step 1: Create a Self Sovereign Identity
########################################

The following code snippet shows how to create a self-sovereign identity with the Jolocom Library. 
For a higher level explanation of identity creation, as well as other usage patterns of the Jolocom 
Library, please refer to the Usage section.

.. note:: Please note that registry will be refactored to use jolocom connectors as default soon.


.. code-block:: typescript

  import { JolocomLib, claimsMetadata } from 'jolocom-lib'

  import { defaultConfig } from 'jolocom-lib/js/defaultConfig'
  import { IpfsStorageAgent } from 'jolocom-lib/js/ipfs'
  import { EthResolver } from 'jolocom-lib/js/ethereum'

  
  
  // create identity manager & derive keys

  const identityManager = JolocomLib.identityManager.create(seed)

  const schema = identityManager.getSchema()

  const identityKey = identityManager.deriveChildKey(schema.jolocomIdentityKey)

  const ethereumKey = identityManager.deriveChildKey(schema.ethereumKey)




  // initialize registry

  const ipfsConnector  = new IpfsStorageAgent(defaultConfig.identity)
  
  const ethereumConnector = new EthResolver(defaultConfig.ipfs)

  const registry = JolocomLib.registry.jolocom.create({ipfsConnector, ethereumConnector})

  

  // create identity

  const identityWallet = await registry.create({
    
    privateIdentityKey: identityKey.privateKey,
    
    privateEthereumKey: ethereumKey.privateKey
    
  })
 


  // this should throw an expected error with 'No public Profile available'

  const publicProfile = identityWallet.identity.publicProfile.get()


#############################################################
Step 2: Create a Public Profile and attach it to the identity
#############################################################

.. code-block:: typescript

  // url and image fields are optional
  
  const myPublicProfile = {
    
    id: identityWallet.getIdentity().getDID(),
    
    name: 'Jolocom',
    
    about: 'We enable a global identity system',
    
    url: 'https://jolocom.com',

    image: 'https://jolocom.com/logo'
  
  }



  // here we create a signed credential

  const publicProfileCred = identityWallet.create.signedCredential({
   
    metadata: claimsMetadata.publicProfile,
   
    claim: myPublicProfile
  
  })


  
  // add the signed credential as your public profile

  identityWallet.identity.publicProfile.add(publicProfileCred)

  
  
  // publish your updated DidDocument

  await registry.commit({
    
    wallet: identityWallet,
    
    ethereumPrivateKey: ethereumKey.privateKey
    
  })



###############################################
Step 3: Define Your Criteria for Single Sign On
###############################################

.. note:: We use `JsonLogic <http://jsonlogic.com/>`_ for constraints definition in credentialRequirements. 
In the example below, the user must provide a credential which is issued by 'did:jolo:showcase'.

.. code-block:: typescript

  const callbackURL = 'https://www.testSSO.com/myCallbackURL'

  
  
  //  define what information you require from user for signing on
  
  
  const credentialRequirements = {
    
    type: ['Credential', 'ProofOfEmailCredential']
    
    constraints: [{ '==': [{ var: 'issuer' }, 'did:jolo:showcase'] }]
  
  }  
  
  
  
  const credRequest = identityWallet.create.credentialRequest({callbackURL, credentialRequirements})

  
  const signedCredReq = identityWallet.sign.credentialRequest(credRequest)

  
  
  // encode signed credential request as JWT and send it

  
  const signedCredReqJWT = signedCredReq.toJWT()


############################################
Step 4: Evaluate Response for Single Sign On
############################################

This is the last step of the Single Sign On process. Here, you can evaluate the response from a user 
to your request.

.. code-block:: typescript

  // convert JWT to SignedCredentialResponse instance

  const signedCredResp = JolocomLib.parse.signedCredentialResponse.fromJWT(receivedSignedCredResp)


  const validSignature = signedCredResp.validateSignature(registry)
  

  const satisfiesRequest = signedCredResp.satisfiesRequest(credRequest)
  

  const receivedCreds = signedCredResp.getSuppliedCredentials()

  
  
  // check signature of provided signed ProofOfEmailCredential

  const validCred = await receivedCreds[0].validateSignature(registry)

  // If the user has fulfilled the indicated requirements from the request, 
  they can now be redirected to the logged in section




