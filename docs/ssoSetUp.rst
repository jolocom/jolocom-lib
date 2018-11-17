Single Sign On (SSO) with Jolocom
==================================

The best way to get some hands on experience with the Jolocom library and identity protocol is to try it out yourself!
In this section we will be looking at how we can deploy a demo service capable of interacting with Jolocom identities.

Clone the Github Repository
#########################################

To begin, we need to clone the Jolocom demo sso repository and install all dependencies:

.. code-block:: bash

  # clone the repository and navigate to the new folder
  git clone https://github.com/jolocom/demo-sso.git; cd ./demo-sso

  # install all dependencies
  yarn install
  # or
  npm install

.. note:: In order to ensure that the application works correctly, you will also need 
  `redis <https://redis.io/topics/quickstart>`_ installed on your local machine. The demo application makes use of the ``redis-server`` and ``redis-cli`` commands to launch, and connect to a local database upon start.


To ensure no errors occured during the instalation steps, we can attempt to start the service:

.. code-block:: bash

  # Ensure you are in the 'demo-sso' folder
  yarn start

If all goes fine, after a few seconds you should see the following printed message: *'Demo service started, listening on port 9000'*.
This means we are ready to go on!

Editing the service configuration file
#######################################

If we open the ``config.ts`` - file located in the project root directory, we will notice that there are 3 options we can configure:

* ``seed`` - A 32 byte ``Buffer`` of random bytes, used for deriving key pairs, as explained 
  in the the `getting started <https://jolocom-lib.readthedocs.io/en/latest/gettingStarted.html#how-to-create-a-self-sovereign-identity>`_ section.
* ``password`` - Password used to encrypt the ``seed`` on the instance. Must be provided for any opperations involving key derivation.
* ``serviceUrl`` - The url that can be used reach the deployed service, if you are testing locally, the default value should suffice.
* ``credentialRequirements`` - the types of credentials required by the service. By default the service requires a ``ProofOfNameCredential``, 
  with no associated constraints.

.. note:: Additional documentation on the ``credentialRequirements`` section will be added shortly.

After the fields have been configured, the service can be started by running ``yarn start``

Authenticating against the local service
#########################################

Now that we have the local service running, we can open our browsers and navigate to ``http://localhost:9000/`` to be presented with the landing page.
If you tap the button to continue with Jolocom, the service will generate a credential 
request (as defined `here <https://jolocom-lib.readthedocs.io/en/latest/interactionFlows.html>`_), encode it as a QR code, and display the resulting image.

At this point the presented request can be scanned using the Jolocom SmartWallet in order to generate the corresponding credential response and share it with the service.

The ``demo-sso`` repository also includes a script that can be run to simulate the client completing the authentication for testing and development purposes.
Further documentation on which can be found `here <https://github.com/jolocom/demo-sso/tree/master/scripts>`_.