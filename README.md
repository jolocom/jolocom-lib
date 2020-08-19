# jolocom-lib

Library for interacting with the self-sovereign identity solution provided by Jolocom.

Interested in our vision? Take a look at our [whitepaper](https://jolocom.io/wp-content/uploads/2019/12/Jolocom-Whitepaper-v2.1-A-Decentralized-Open-Source-Solution-for-Digital-Identity-and-Access-Management.pdf) (we are refining our architecture currently, and will update the whitepaper accordingly).

Want to use our library? Please refer to the following resources:

- [Library documentation](https://jolocom-lib.readthedocs.io/en/latest/gettingStarted.html)
- [Automatically generated api documentation](https://htmlpreview.github.io/?https://raw.githubusercontent.com/jolocom/jolocom-lib/master/api_docs/documentation/globals.html)
- [Generic backend](https://github.com/jolocom/generic-backend) - exposes a set of HTTP endpoints for client applications to interact with.
- [Demo service frontend](https://gitlab.com/jolocom/municipal-service) - to interact with the generic backend.
  - Instructions can be found in the repository README, more about the project as a whole can be found [here](https://stories.jolocom.com/demo-services-using-ssi-building-blocks-now-available-607e2ccd506d).
- Various Useful snippets: [Here](https://github.com/Exulansis/web3_snippets), and [here](https://github.com/Exulansis/Validation-Examples)

Integration and unit tests located in the ``./tests`` folder are a good place to start too.

[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/jolocom/SmartWallet)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Requirements

Starting with version `2.3.0`, the Jolocom Library requires `Node.js v10` or `Node.js v11` to run. Versions prior to `2.3.0` require `Node.js v8`.

## Linting and Formatting

We use [ESLint](https://eslint.org/) for static TypeScript code analysis.  
We use [Prettier](https://prettier.io/) for auto formatting of our code, but this is configured to run as part of ESLint.  
To display real-time linting errors, an ESLint plugin must be installed in your IDE or text editor.  
On VSCode, it is possible to allow ESLint to format upon saving of files, which will run Prettier under the options within this project.  

Additionally, we have included a script in package.json to allow use of ESlint/Prettier from the CLI:

- `yarn format` will auto-fix as many problems as it can in the project in files with the extension `.ts`, and log unfixed errors to the console.

## Contributing
[Help Develop Jolocom Software](https://github.com/jolocom/jolocom#contributing)
