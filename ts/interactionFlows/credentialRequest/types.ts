export interface ICredentialRequestPayloadAttrs {
  iat: number
  iss: string
  typ: string
  credentialRequest: ICredentialRequestCreationAttrs
}

export interface ICredentialRequestPayloadCreationAttrs {
  typ: string
  credentialRequest: ICredentialRequestCreationAttrs
}

export type requestedCredentialAttrs = Array<{type: string[], constraints: IConstraint[]}>

export interface ICredentialRequestCreationAttrs {
  callbackURL: string
  credentialRequirements: requestedCredentialAttrs
}

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

// TODO: Should be upper case
export type comparable = number | Date
export type constraintFunc = (field: string, value: string ) => IConstraint
export type comparableConstraintFunc = (field: string, value: comparable) => IConstraint

export interface IExposedConstraintFunctions {
  is: constraintFunc
  not: constraintFunc
  greater: comparableConstraintFunc
  smaller: comparableConstraintFunc
}

// TODO: clean up interfaces, remove duplicates etc
export interface ICredentialRequestAttrs {
  callbackURL: string
  credentialRequirements: ICredentialRequest[]
}
