import { expect } from 'chai'

describe('Dependency updates', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageJson = require('../../package.json')
  it('should test if eccrypto was changed', () => {
    expect(packageJson.dependencies.eccrypto).to.eq(
      'rootstock/eccrypto#485e11f163093fb6e0d5263fa46ed5075dedfe88',
      'This fork is used because there was a bug in React-Native - https://github.com/jolocom/jolocom-lib/issues/384',
    )
  })
})
