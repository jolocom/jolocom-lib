import { Identity } from '../identity/identity'
import { IVaultedKeyProvider, KeyTypes } from '../vaultedKeyProvider/types'
import { IKeyMetadata } from '../credentials/signedCredential/types'
import { IContractsAdapter, IContractsGateway } from '../contracts/types'
import {
  IAuthenticationAttrs,
  ICredentialOfferAttrs,
  ICredentialRequestAttrs,
  ICredentialResponseAttrs,
  ICredentialsReceiveAttrs,
  IPaymentResponseAttrs,
} from '../interactionTokens/interactionTokens.types'

export interface IIdentityWalletCreateArgs {
  vaultedKeyProvider: IVaultedKeyProvider
  identity: Identity
  publicKeyMetadata: IKeyMetadata
  contractsAdapter: IContractsAdapter
  contractsGateway: IContractsGateway
}

export type PublicKeyMap = { [key in keyof typeof KeyTypes]?: string }

export type CredentialShareRequestCreationArgs = ICredentialRequestAttrs
export type CredentialShareResponseCreationArgs = ICredentialResponseAttrs
export type CredentialOfferRequestCreationArgs = ICredentialOfferAttrs
export type CredentialOfferResponseCreationArgs = ICredentialsReceiveAttrs
export type PaymentResponseCreationArgs = IPaymentResponseAttrs

export type AuthCreationArgs = {
  callbackURL: string,
  description?: string
}

export interface PaymentRequestCreationArgs {
  callbackURL: string
  description: string
  transactionOptions: {
    value: number
    to?: string
    gasLimit?: number
    gasPrice?: number
  }
}
