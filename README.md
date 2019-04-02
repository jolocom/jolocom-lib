# jolocom-lib

Library for interacting with the self-sovereign identity solution provided by Jolocom.

Interested in our vision? Take a look at our [whitepaper](http://jolocom.io/wp-content/uploads/2018/07/Jolocom-Technical-WP-_-Self-Sovereign-and-Decentralised-Identity-By-Design-2018-03-09.pdf) (it is currently outdated, and we are working on updating it).

Want to use our library? Please refer to the following resources:

- [Library documentation](https://jolocom-lib.readthedocs.io/en/latest/gettingStarted.html)
- [Automatically generated api documentation](https://htmlpreview.github.io/?https://raw.githubusercontent.com/jolocom/jolocom-lib/master/api_docs/documentation/globals.html)
- [Demo service implementation](https://github.com/jolocom/demo-sso)
- [Demo service application implementation](https://github.com/jolocom/demo-sso-mobile)
- Various Useful snippets: [Here](https://github.com/Exulansis/web3_snippets), and [here](https://github.com/Exulansis/Validation-Examples)

Integration and unit tests located in the ``./tests`` folder are a good place to start too.

[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/jolocom/jolocom-lib)

## Requirements

Starting with version `2.3.0`, the Jolocom Library requires `Node.js v10+` to run. Versions prior to `2.3.0` require `Node.js v8`.

## Linting and Formatting

We use [ESLint](https://eslint.org/) for static TypeScript code analysis.  
We use [Prettier](https://prettier.io/) for auto formatting of our code, but this is configured to run as part of ESLint.  
To display real-time linting errors, an ESLint plugin must be installed in your IDE or text editor.  
On VSCode, it is possible to allow ESLint to format upon saving of files, which will run Prettier under the options within this project.  

Additionally, we have included a script in package.json to allow use of ESlint/Prettier from the CLI:

- `yarn format` will auto-fix as many problems as it can in the project in files with the extension `.ts`, and log unfixed errors to the console.
