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
  IPaymentRequestAttrs,
  IAuthenticationAttrs,
} from '../interactionTokens/interactionTokens.types'

export interface IIdentityWalletCreateArgs {
  vaultedKeyProvider: IVaultedKeyProvider
  identity: Identity
  publicKeyMetadata: IKeyMetadata
  contractsAdapter: IContractsAdapter
  contractsGateway: IContractsGateway
}

/**
 * Will set all keys on an interface to Optional (?), except the provided one.
 * @example TargetPartial<{name: string, age: number}, "name"> // {name: string, age?: number}
 */

type ExclusivePartial<T, K extends keyof T> = Partial<Omit<T, K>> &
  Required<Pick<T, K>>

export type PublicKeyMap = { [key in keyof typeof KeyTypes]?: string }

export type AuthCreationArgs = ExclusivePartial<
  IAuthenticationAttrs,
  'callbackURL'
>

export type CredentialReceiveCreationArgs = ICredentialsReceiveAttrs
export type CredentialShareRequestCreationArgs = ICredentialRequestAttrs
export type CredentialShareResponseCreationArgs = ICredentialResponseAttrs

export type CredentialOfferRequestCreationArgs = CredentialOfferRequestAttrs
export type CredentialOfferResponseCreationArgs = CredentialOfferResponseAttrs

export type PaymentResponseCreationArgs = IPaymentResponseAttrs
export interface PaymentRequestCreationArgs {
  callbackURL: string
  description: string
  transactionOptions: ExclusivePartial<
    IPaymentRequestAttrs['transactionOptions'],
    'value'
  >
}
