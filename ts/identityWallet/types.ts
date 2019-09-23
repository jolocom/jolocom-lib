import { Identity } from '../identity/identity'
import { IVaultedKeyProvider } from '../vaultedKeyProvider/types'
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

/**
 * @dev We use Class Transformer (CT) to instantiate all interaction Tokens. Because
 * of CT we can't define constructors on the interaction token classes.
 * The de facto constructor is the `fromJSON(json)` call. Therefore the arguments
 * to instantiate one are often times the same as for `fromJSON`.
 *  Some values are optional because the function instantiating the Interaction Token
 * can sometimes set sane defaults.
 * As a conclusion, A lot of the interfaces for creating a new interaction token using
 * the identity wallet match the JSON interface (with some keys potentially optional)
 */

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
