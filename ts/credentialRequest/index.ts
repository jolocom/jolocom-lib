import { plainToClass, classToPlain } from 'class-transformer'
import {
  ICredentialRequestAttrs,
  constraintFunc, comparable,
  IConstraint,
  comparableConstraintFunc,
  IExposedConstraintFunctions
} from './types'

export class CredentialRequest {

  public toJSON(): ICredentialRequestAttrs {
    return classToPlain(this) as ICredentialRequestAttrs
  }

  public fromJSON(json: ICredentialRequestAttrs): CredentialRequest {
    return plainToClass(CredentialRequest, json)
  }
}

export const constraintFunctions: IExposedConstraintFunctions = {
  is: (field: string, value: string) => assembleStatement('==', field, value),
  not: (field: string, value: string) => assembleStatement('!=', field, value),
  greater: (field: string, value: comparable) => assembleStatement('>', field, value),
  smaller: (field: string, value: comparable) => assembleStatement('<', field, value)
}

const assembleStatement = (operator: string, field: string, value: string | comparable): IConstraint => {
  return { [operator]: [{ var: field }, value] } as IConstraint
}
