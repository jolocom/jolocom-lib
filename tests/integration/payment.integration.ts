import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import {
  userPass,
  servicePass,
  userVault
} from './integration.data'
import {
  userIdentityWallet,
  serviceIdentityWallet,
  jolocomRegistry,
  jolocomEthTransactionConnector
} from './identity.integration'
import { publicKeyToAddress } from '../../ts/utils/helper'
import { KeyTypes } from '../../ts/vaultedKeyProvider/types'
import { PaymentRequest } from '../../ts/interactionTokens/paymentRequest'
import { JSONWebToken } from '../../ts/interactionTokens/JSONWebToken'
import { PaymentResponse } from '../../ts/interactionTokens/paymentResponse'
const EthereumTx = require('ethereumjs-tx')

chai.use(sinonChai)
const expect = chai.expect

describe('Integration Test - EXPERIMENTAL Token interaction flow Payment', () => {
  let paymentRequestJWT
  let paymentRequestEncoded
  let paymentResponseJWT
  let paymentResponseEncoded

  it('Should create a payment request token by service', async () => {
    const serviceEthereumAddress = publicKeyToAddress(
      serviceIdentityWallet.getPublicKey({
        encryptionPass: servicePass,
        derivationPath: KeyTypes.ethereumKey
      })
    )

    /**
     * Note that the ethereum address from user should be known to service before creating payment request
     * This can be achieved e.g. by using the credential request beforehand to get the ethereum address
     */

    const userEthereumAddress = publicKeyToAddress(
      userIdentityWallet.getPublicKey({
        encryptionPass: userPass,
        derivationPath: KeyTypes.ethereumKey
      })
    )

    const paymentReqCreationArgs = {
      callbackURL: 'https://awesomeservice.com/payment/pending',
      description: 'Payment for monthly subscription to awesome service',
      transactionDetails: {
        receiverAddress: serviceEthereumAddress,
        senderAddress: userEthereumAddress,
        amountInEther: '0.01'
      }
    }
    paymentRequestJWT = await serviceIdentityWallet.create.interactionTokens.request.payment(
      paymentReqCreationArgs,
      servicePass
    )

    paymentRequestEncoded = paymentRequestJWT.encode()

    expect(paymentRequestJWT).to.be.instanceOf(JSONWebToken)
    expect(paymentRequestJWT.interactionToken).to.be.instanceOf(PaymentRequest)
    expect(paymentRequestJWT.interactionToken).to.deep.equal(
      PaymentRequest.fromJSON(paymentReqCreationArgs)
    )
  })

  it('Should allow for consumption of valid payment request by user', async () => {
    const decodedPaymentRequest = JSONWebToken.decode<PaymentRequest>(
      paymentRequestEncoded
    )
    expect(decodedPaymentRequest.interactionToken).to.be.instanceOf(
      PaymentRequest
    )

    try {
      await serviceIdentityWallet.validateJWT(
        decodedPaymentRequest,
        null,
        jolocomRegistry
      )
    } catch (err) {
      expect(true).to.be.false
    }
  })

  it('Should create a payment response by user', async () => {
    const decodedPaymentRequest = JSONWebToken.decode<PaymentRequest>(
      paymentRequestEncoded
    )
    const { transactionDetails } = decodedPaymentRequest.interactionToken

    const ethTransaction = await jolocomEthTransactionConnector.createTransaction(
      transactionDetails
    )
    expect(ethTransaction).to.be.instanceOf(EthereumTx)

    // TODO: this step needs to be consolidated with vault
    const userEthPrivKey = userVault.getPrivateKey({
      encryptionPass: userPass,
      derivationPath: KeyTypes.ethereumKey
    })
    ethTransaction.sign(userEthPrivKey)

    const serializedTX = ethTransaction.serialize()

    let txReceipt
    try {
      txReceipt = await jolocomEthTransactionConnector.sendSignedTransaction(
        serializedTX
      )
    } catch (err) {
      console.log('ERROR: ', err)
      expect(false).to.be.true
    }

    paymentResponseJWT = await userIdentityWallet.create.interactionTokens.response.payment(
      { txHash: txReceipt.transactionHash },
      userPass,
      decodedPaymentRequest
    )

    paymentResponseEncoded = paymentResponseJWT.encode()

    expect(paymentResponseJWT.interactionToken).to.be.instanceOf(
      PaymentResponse
    )
    expect(paymentResponseJWT.interactionToken.txHash).to.equal(
      txReceipt.transactionHash
    )
  })

  it('Should allow for consumption of valid payment response by service', async () => {
    const decodedPaymentResponse = JSONWebToken.decode<PaymentResponse>(
      paymentResponseEncoded
    )
    expect(decodedPaymentResponse.interactionToken).to.be.instanceOf(
      PaymentResponse
    )

    try {
      await serviceIdentityWallet.validateJWT(
        decodedPaymentResponse,
        paymentRequestJWT,
        jolocomRegistry
      )
    } catch (err) {
      expect(true).to.be.false
    }
  })
})
