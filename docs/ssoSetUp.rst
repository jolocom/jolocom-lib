Single Sign On (SSO) with Jolocom
==================================

The best way to get some hands on experience with the Jolocom library and identity protocol is to try it out for yourself!
In this section we examine how to deploy a demo service capable of interacting with Jolocom identities.

Clone the Github repository
#########################################

To begin, clone the Jolocom demo sso repository and install all dependencies:

.. code-block:: bash

  # clone the repository and navigate to the new folder
  git clone https://github.com/jolocom/demo-sso.git; cd ./demo-sso

  # install all dependencies
  yarn install
  # or
  npm install

.. note:: In order to ensure that the application works correctly, you will also need
  `redis <https://redis.io/topics/quickstart>`_ installed on your local machine. The demo application makes use of the ``redis-server`` and ``redis-cli`` commands to launch and to connect to a local database upon start.


To ensure no errors occurred during installation, we can attempt to start the service:

.. code-block:: bash

  # Ensure you are in the 'demo-sso' folder
  yarn start

If everything is setup properly, you should see the following printed message after a few seconds:
*'Demo service started, listening on port 9000'*.

If you don't see the message or encounter an unexpected error, get in touch with the Jolocom team for troubleshooting support.

Once you see the message, you're ready to move on.

Editing the service configuration file
#######################################

If we open the ``config.ts`` - file located in the project root directory, we will notice that there are three options we can configure:

* ``seed`` - A 32 byte ``Buffer`` of random bytes, used for deriving key pairs, as explained
 in the the `Getting Started <https://jolocom-lib.readthedocs.io/en/latest/gettingStarted.html#how-to-create-a-self-sovereign-identity>`_ section.
* ``password`` - The password used to encrypt the ``seed`` on the instance. Must be provided for any operations involving key derivation.
* ``serviceUrl`` - The url that can be used reach the deployed service, if you are testing locally, the default value should suffice.
* ``credentialRequirements`` - The types of credentials required by the service. By default the service requires a ``ProofOfNameCredential``,
 with no associated constraints.

.. note:: Additional documentation on the ``credentialRequirements`` section will be added soon.

After the fields have been configured, the service can be started by running ``yarn start``.

Authenticating against the local service
#########################################

With the local service running, open a browser and navigate to ``http://localhost:9000/``. 
Tapping the button “Continue with Jolocom” on the landing page that loads will generate a credential request (as defined `here 
<https://jolocom-lib.readthedocs.io/en/latest/interactionFlows.html>`_), encode it as a QR code, and display the resulting image.

At this point the presented request can be scanned using the Jolocom SmartWallet to generate the corresponding credential response for sharing with the service.

The ``demo-sso`` repository also includes a script that can be run to simulate the client completing the authentication for testing and development purposes.
Further documentation on the authentication test script can be found `here <https://github.com/jolocom/demo-sso/tree/master/scripts>`_.