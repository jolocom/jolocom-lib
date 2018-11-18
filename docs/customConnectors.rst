Using custom connectors
========================

By default, all identities created using the Jolocom library are indexed in a contract deployed on the Rinkeby test network,
and the corresponding DID documents are stored on IPFS.

The interaction with the corresponding networks is delegated to two components:

* `IPFS connector <https://github.com/jolocom/jolocom-lib/blob/master/ts/ipfs/types.ts#L7>`_
* `Ethereum connector <https://github.com/jolocom/jolocom-lib/blob/master/ts/ethereum/types.ts#L12>`_

Using custom connectors (e.g. to experiment on a private network) is also supported.

You can also supply your custom implementations of both connectors, in case your identities are indexed on a private Ethereum deployment, or you would like to connect to a custom IPFS cluster. A custom implementation might look as follows:

.. code-block:: typescript

  class CustomEthereumConnector implements IEthereumConnector {
    async resolveDID(did: string) {
      console.log(`Intercepted request for ${did}`)
      return fetchFromCacheIfAvailable(did)
    }

    async updateDIDRecord(args: IEthereumResolverUpdateDIDArgs) {
      console.log(`Intercepted request for ${args.did}, updating to ${args.newHash}`)
      return queueUpdateRequest(args)
    }
  }

  class CustomIpfsConnector implements IIpfsConnector {
    async storeJSON({ data, pin }: { data: object; pin: boolean }) {
      ...
    }

    async catJSON(hash: string) {
      ...
    }

    async removePinnedHash(hash: string) {
      ...
    }
  }

  const customRegistry = JolocomLib.registries.jolocom.create({
    ethereumConnector: new CustomEthereumConnector(),
    ipfsConnector: new CustomIpfsConnector()
  })

.. note:: Using only one custom connector is also supported. 

  In the event a connector is not provided when instantiating the ``registry``, the default
  implementation provided by Jolocom will be used.

In some cases, it might make sense to define connectors that rely fully on databases maintained in a centralised manner.
The current library API supports this use case as well.