export type constraintStatement = boolean[] | Array<{ var: string } | string | comparable >
export interface IConstraint {
  [operator: string]: constraintStatement
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

export type requestedCredentialArgs = Array<{type: string[], constraints: IConstraint[]}>
export interface ICredentialRequestCreationArgs {
  callbackURL: string
  requestedCredentials: requestedCredentialArgs
}
