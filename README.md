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

Please use ```Node.js 10+``` from version 2.3.0 of the library.

## TSLINT for development

We use `tslint` for static Typescript code analysis.  
`tslint [file]` running code analysis  
`tslint [file] --fix` running automatic fix of rule violations (fixes most of the common issues)
