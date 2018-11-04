export type Operator = '==' | '!=' | '<' | '>'

type RequestedCredentialAttrs = Array<{ type: string[]; constraints: IConstraint[] }>

export interface ICredentialRequestCreationAttrs {
  callbackURL: string
  credentialRequirements: RequestedCredentialAttrs
}

export interface IConstraint {
  [operator: string]: boolean[] | Array<{ var: string } | string | Comparable>
}

export interface ICredentialRequest {
  type: string[]
  constraints: IConstraint[]
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

// TODO: clean up interfaces, remove duplicates etc
export interface ICredentialRequestAttrs {
  callbackURL: string
  credentialRequirements: ICredentialRequest[]
}
