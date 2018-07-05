=================================
Single Sign On (SSO) with Jolocom
=================================

This section shows how to implement a single sign on with the jolocom-lib.
This can be relevant for services, dapp developer etc.

########################################
Step 1: Create a Self Sovereign Identity
########################################

The Usage section covers the creation and interaction patterns in more depth; here the focus is on a code example:

.. note:: Please note that registry will be refactored to use jolocom connectors as default soon.


.. code-block:: typescript

  import { JolocomLib, claimsMetadata } from 'jolocom-lib'

  import { defaultConfig } from 'jolocom-lib/js/defaultConfig'
  import { IpfsStorageAgent } from 'jolocom-lib/js/ipfs/'
  import { EthResolver } from 'jolocom-lib/js/ethereum'

  
  
  // create identity manager & derive keys

  const indetityManager = JolocomLib.identityManager.create(seed)

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
Step 2: Create a Public Profile and attach it to the Identity
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

  const publicProfileCred = idnentityWallet.create.signedCredential({
   
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

.. note:: We use `JsonLogic <http://jsonlogic.com/>`_ for constrains definition in credentialRequirements. In the example below
  the user has to provide a credential which is issued by 'did:jolo:showcase'.

.. code-block:: typescript

  const callbackURL = 'https://www.testSSO.com/myCallbackURL'

  
  
  //  define what information you require from user for signing on
  
  
  const credentialRequirements = {
    
    type: ['Credential', 'ProofOfEmailCredential']
    
    constraints: [{ '==': [{ var: 'issuer' }, 'did:jolo:showcase'] }]
  
  }  
  
  
  
  const credRequest = identityWallet.create.credentialRequest({callbackURL, credentialRequirements})

  
  const signedCredReq = idnetityWallet.sign.credentialRequest(credRequest)

  
  
  // encode signed credential request as JWT and send it

  
  const signedCredReqJWT = signedCredReq.toJWT()




############################################
Step 4: Evaluate Response for Single Sign On
############################################

This is the last step during the Single Sign On. Here you evaluate the response from a user to your request.

.. code-block:: typescript

  // convert JWT to SignedCredentialResponse instance

  const signedCredResp = JolocomLib.parse.signedCredentialResponse.fromJWT(receivedSignedCredResp)


  const validSignature = signedCredResp.validateSignature(registry)
  

  const satisfiesRequest = signedCredResp.satisfiesRequest(credRequest)
  

  const receivedCreds = signedCredResp.getSuppliedCredentials()

  
  
  // check signature of provided signed ProofOfEmailCredential

  const validCred = await receivedCreds[0].validateSignature(registry)


  
  
  // user has fulfilled your requirements; redirect to logged in section





