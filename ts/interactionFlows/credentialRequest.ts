import * as jsonlogic from 'json-logic-js'
import { plainToClass, classToPlain } from 'class-transformer'
import { areCredTypesEqual } from '../utils/credentials'
import {
  ICredentialRequestAttrs,
  Comparable,
  IExposedConstraintFunctions,
  ICredentialRequest,
  IConstraint,
} from './credentialRequest/types'
import { ISignedCredentialAttrs } from '../credentials/signedCredential/types'

export class CredentialRequest {
  private callbackURL: string
  private credentialRequirements: ICredentialRequest[] = []

  public getCallbackURL(): string {
    return this.callbackURL
  }

  public getRequestedCredentials(): ICredentialRequest[] {
    return this.credentialRequirements
  }

  public getRequestedCredentialTypes(): string[][] {
    return this.credentialRequirements.map(credential => credential.type)
  }

  public setCallbackURL(url: string) {
    this.callbackURL = url
  }

  public applyConstraints(credentials: ISignedCredentialAttrs[]): ISignedCredentialAttrs[] {
    return credentials.filter(credential => {
      const relevantConstraints = this.credentialRequirements.find(section =>
        areCredTypesEqual(section.type, credential.type)
      )

      if (relevantConstraints) {
        return jsonlogic.apply(relevantConstraints.constraints, credential)
      }
    })
  }

  public toJSON(): ICredentialRequestAttrs {
    return classToPlain(this) as ICredentialRequestAttrs
  }

  public static fromJSON(json: ICredentialRequestAttrs): CredentialRequest {
    return plainToClass(CredentialRequest, json)
  }
}

export const constraintFunctions: IExposedConstraintFunctions = {
  is: (field: string, value: string) => assembleStatement('==', field, value),
  not: (field: string, value: string) => assembleStatement('!=', field, value),
  greater: (field: string, value: Comparable) => assembleStatement('>', field, value),
  smaller: (field: string, value: Comparable) => assembleStatement('<', field, value)
}

const assembleStatement = (operator: string, field: string, value: string | Comparable): IConstraint => {
  return { [operator]: [{ var: field }, value] } as IConstraint
}
