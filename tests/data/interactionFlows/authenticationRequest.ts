export const jsonAuthRequest = {
  challenge: 'erhbgiö3jrewlprg',
  callbackURL: 'https://me.test.io'
}

export const challenge = 'erhbgiö3jrewlprg'
export const callbackURL = 'https://me.test.io'

export const jsonAuthRequestPayload = {
  authRequest: {
       challenge: 'erhbgiö3jrewlprg',
       callbackURL: 'https://me.test.io'
  },
  typ: 'authenticationRequest'
}

export const mockJsonAuthRequestPayload = {
  authRequest: {
       challenge: 'erhbgiö3jrewlprg',
       callbackURL: 'https://me.test.io'
  },
  typ: 'authenticationRequest',
  iss: 'did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb',
  iat: 0
}