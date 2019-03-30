import { ISignedCredentialAttrs } from "../credentials/signedCredential/types"

/* Creation attributes. Same as JSON form */

export interface IPaymentRequestAttrs {
  callbackURL: string
  description: string
  transactionDetails: ITransactionOptions
}

export interface ITransactionOptions {
  receiverAddress: string,
  amountInWei: number,
  chainId?: number,
}

export interface IPaymentResponseAttrs {
  txHash: string
}

export interface ICredentialOfferAttrs {
  callbackURL: string
  instant: boolean
  requestedInput: {
    [key: string]: string | null
  }
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
}

/* Related to constraint functions */

export type Operator = '==' | '!=' | '<' | '>'

export interface IConstraint {
  [operator: string]: boolean[] | Array<{ var: string } | string | Comparable>
}

export type Comparable = number | Date
type ConstraintFunc = (field: string, value: string) => IConstraint
type ComparableConstraintFunc = (field: string, value: Comparable) => IConstraint

export interface IExposedConstraintFunctions {
  is: ConstraintFunc
  not: ConstraintFunc
  greater: ComparableConstraintFunc
  smaller: ComparableConstraintFunc
}
