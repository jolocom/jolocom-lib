import { plainToClass, classToPlain } from 'class-transformer'
import * as jsonlogic from 'json-logic-js'
import { areCredTypesEqual } from '../../utils/credentials'
import {
  ICredentialRequestAttrs,
  Comparable,
  IExposedConstraintFunctions,
  ICredentialRequest,
  IConstraint,
  ICredentialRequestCreationAttrs
} from './types'
import { ISignedCredentialAttrs } from '../../credentials/signedCredential/types'

export class CredentialRequest {
  public callbackURL: string
  public credentialRequirements: ICredentialRequest[] = []

  public static create(args: ICredentialRequestCreationAttrs): CredentialRequest {
    const credentialRequest = new CredentialRequest()
    credentialRequest.setCallbackURL(args.callbackURL)
    args.credentialRequirements.forEach((req) => credentialRequest.addCredentialRequirement(req))
    return credentialRequest
  }

  private addCredentialRequirement({constraints, type}: {type: string[], constraints: IConstraint[]}) {
    const credConstraints = {
      and: [
        { '==': [true, true] },
        ...constraints
      ]
    }

    this.credentialRequirements.push({ type, constraints: credConstraints })
  }

  public setCallbackURL(url: string) {
    this.callbackURL = url
  }

  public getCallbackURL(): string {
    return this.callbackURL
  }

  public getRequestedCredentials(): ICredentialRequest[] {
    return this.credentialRequirements
  }

  public getRequestedCredentialTypes(): string[][] {
    return this.credentialRequirements.map((credential) => credential.type)
  }

  public applyConstraints(credentials: ISignedCredentialAttrs[]): ISignedCredentialAttrs[] {
    return credentials.filter((credential) => {
      const relevantConstraints = this.credentialRequirements.find((section) =>
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
