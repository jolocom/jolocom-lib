import { expect } from 'chai'
import { JolocomLib } from '../../ts/index'

describe('Parse', () => {
  it('Should expose correct interface', () => {
    expect(Object.keys(JolocomLib.parse)).to.deep.eq([
      'interactionToken',
      'credential',
      'signedCredential',
    ])
    expect(Object.keys(JolocomLib.parse.interactionToken)).to.deep.eq([
      'fromJWT',
      'fromJSON',
    ])
  })
})
