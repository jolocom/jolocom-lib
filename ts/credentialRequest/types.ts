export interface IConstraint {
  [operator: string]: boolean[] | Array<{ var: string } | string | comparable >
}

export interface ICredentialRequest {
  type: string[]
  constraints: {
    and: IConstraint[]
  }
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

export interface ICredentialRequestAttrs {
  callbackURL: string
  requestedCredentials: ICredentialRequest[]
}
