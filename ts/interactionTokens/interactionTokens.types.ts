import { TransactionOptions } from '../contracts/types'
import { ISignedCredentialAttrs } from '../credentials/signedCredential/types'

export interface IPaymentRequestAttrs {
  callbackURL: string
  description: string
  transactionOptions: TransactionOptions
}

export interface IPaymentResponseAttrs {
  txHash: string
}

enum CredentialRenderTypes {
  document = 'document',
  permission = 'permission',
  claim = 'claim',
}

export type CredentialOfferInputRequest = {
  [key: string]: string | null
}

export type CredentialOfferRenderInfo = {
  renderAs?: CredentialRenderTypes
  background: {
    color: string // Hex value
    url: string // URL to base64 encoded background image
  }
  logo: {
    url: string // URL to base64 encoded image
  }
  text: {
    color: string // Hex value
  }
}

export type CredentialOfferMetadata = {
  asynchronous?: boolean
}

export type CredentialOffer = {
  type: string
  requestedInput?: CredentialOfferInputRequest
  renderInfo?: CredentialOfferRenderInfo
  metadata?: CredentialOfferMetadata
}

export type CredentialOfferRequestAttrs = {
  callbackURL: string
  offeredCredentials: Array<CredentialOffer>
}

export type CredentialOfferResponseSelection = {
  type: string
  providedInput?: {
    [key: string]: string | null
  }
}

export type CredentialOfferResponseAttrs = {
  callbackURL: string
  selectedCredentials: Array<CredentialOfferResponseSelection>
}

export interface ICredentialRequestAttrs {
  callbackURL: string
  credentialRequirements: ICredentialRequest[]
}

export interface ICredentialResponseAttrs {
  callbackURL: string
  suppliedCredentials: ISignedCredentialAttrs[]
}

export interface ICredentialsReceiveAttrs {
  signedCredentials: ISignedCredentialAttrs[]
}

export interface ICredentialRequest {
  type: string[]
  constraints: IConstraint[]
}

export interface IAuthenticationAttrs {
  callbackURL: string
  description: string
}

/* Related to constraint functions */

export type Operator = '==' | '!=' | '<' | '>'

export interface IConstraint {
  [operator: string]: boolean[] | Array<{ var: string } | string | Comparable>
}

export type Comparable = number | Date
type ConstraintFunc = (field: string, value: string) => IConstraint
type ComparableConstraintFunc = (
  field: string,
  value: Comparable,
) => IConstraint

export interface IExposedConstraintFunctions {
  is: ConstraintFunc
  not: ConstraintFunc
  greater: ComparableConstraintFunc
  smaller: ComparableConstraintFunc
}
