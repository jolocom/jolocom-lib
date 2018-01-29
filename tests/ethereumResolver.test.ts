import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

import identityData from './data/identity'
import ethereumData from './data/ethereum'

import EthereumResolver from '../ts/ethereum/ethereumResolver'

chai.use(chaiAsPromised)
const expect = chai.expect


describe('Ethereum Resolver', () => {
  const ethResolver = new EthereumResolver()
  it('Should correctly register a user\'s DDO hash', async () => {
    const hash = await ethResolver.updateDIDRecord(
      ethereumData.firstTestAccount, identityData.testUserDID,
      ethereumData.mockDDOHash
    )

    expect(await ethResolver.resolveDID(identityData.testUserDID))
      .to.equal(ethereumData.mockDDOHash)
  })

  it('Should return error in case writting record fails', async () => {
    await expect(ethResolver.updateDIDRecord(
      ethereumData.secondTestAcount,
      identityData.testUserDID,
      ethereumData.mockDDOHash
    )).to.be.rejectedWith(
      'Returned error: VM Exception while processing transaction: revert'
    )
  })

  it('Should correctly query contract for the user\'s DDO hash', async () => {
    const hash = await ethResolver.resolveDID(identityData.testUserDID)
    expect(hash).to.equal(ethereumData.mockDDOHash)
  })

  it('Should return error in case reading record fails', async () => {
    await expect(ethResolver.resolveDID('invalidInput')).to.be.rejected
  })
})
