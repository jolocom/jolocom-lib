import { Identity } from '../identity/identity'
import { IVaultedKeyProvider, KeyTypes } from '../vaultedKeyProvider/types'
import { IKeyMetadata } from '../credentials/signedCredential/types'
import { IContractsAdapter, IContractsGateway } from '../contracts/types'
import {
  CredentialOfferRequestAttrs,
  CredentialOfferResponseAttrs,
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

export interface AuthCreationArgs {
  callbackURL: string
  description?: string
}

export type CredentialReceiveCreationArgs = ICredentialsReceiveAttrs
export type CredentialShareRequestCreationArgs = ICredentialRequestAttrs
export type CredentialShareResponseCreationArgs = ICredentialResponseAttrs

export type CredentialOfferRequestCreationArgs = CredentialOfferRequestAttrs
export type CredentialOfferResponseCreationArgs = CredentialOfferResponseAttrs

export type PaymentResponseCreationArgs = IPaymentResponseAttrs
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
