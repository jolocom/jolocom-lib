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

export type RequestedCredentialAttrs = Array<{type: string[], constraints: IConstraint[]}>

export interface ICredentialRequestCreationAttrs {
  callbackURL: string
  credentialRequirements: RequestedCredentialAttrs
}

export type ConstraintStatement = boolean[] | Array<{ var: string } | string | Comparable >

export interface IConstraint {
  [operator: string]: ConstraintStatement
}

export interface ICredentialRequest {
  type: string[]
  constraints: {
    and: IConstraint[]
  }
}

// TODO: Should be upper case
export type Comparable = number | Date
export type ConstraintFunc = (field: string, value: string ) => IConstraint
export type ComparableConstraintFunc = (field: string, value: Comparable) => IConstraint

export interface IExposedConstraintFunctions {
  is: ConstraintFunc
  not: ConstraintFunc
  greater: ComparableConstraintFunc
  smaller: ComparableConstraintFunc
}

// TODO: clean up interfaces, remove duplicates etc
export interface ICredentialRequestAttrs {
  callbackURL: string
  credentialRequirements: ICredentialRequest[]
}
