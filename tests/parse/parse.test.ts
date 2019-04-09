import { expect } from 'chai'
import { JolocomLib } from '../../ts/index'
import { Credential } from '../../ts/credentials/credential/credential'
import { JSONWebToken } from '../../ts/interactionTokens/JSONWebToken'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'

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

  /* A bit hacky, but deep eq for functions is tricky. Should work most of the time */

  it('Should proxy to correct methods', () => {
    expect(JolocomLib.parse.credential.toString()).to.deep.eq(
      Credential.fromJSON.toString(),
    )
    expect(JolocomLib.parse.signedCredential.toString()).to.deep.eq(
      SignedCredential.fromJSON.toString(),
    )
    expect(JolocomLib.parse.interactionToken.fromJSON.toString()).to.deep.eq(
      JSONWebToken.fromJSON.toString(),
    )
    expect(JolocomLib.parse.interactionToken.fromJWT.toString()).to.deep.eq(
      JSONWebToken.decode.toString(),
    )
  })
})
