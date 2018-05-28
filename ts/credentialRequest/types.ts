export interface ICredentialRequest {
  type: string[]
  constraints: constraintFunc[]
}

export interface ICredentialRequestAttrs {
  requesterIdentity: string
  callbackURI: string
  requestedCredentials: ICredentialRequest[]
}

export interface IConstraint {
  [operator: string]: [{ var: string }, string | comparable]
}

export type comparable = number | Date
export type constraintFunc = (field: string, value: string ) => IConstraint
export type comparableConstraintFunc = (field: string, value: comparable) => IConstraint

export interface IExposedConstraintFunctions {
  is: constraintFunc
  not: constraintFunc
  greater: comparableConstraintFunc
  smaller: comparableConstraintFunc
}
