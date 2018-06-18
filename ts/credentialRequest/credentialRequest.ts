import { plainToClass, classToPlain } from 'class-transformer'
import * as jsonlogic from 'json-logic-js'
import { areCredTypesEqual } from '../utils/credentials'
import { ISignedCredentialAttrs } from '../credentials/signedCredential/types'
import {
  ICredentialRequestAttrs,
  comparable,
  IExposedConstraintFunctions,
  ICredentialRequest,
  IConstraint
} from './types'

export class CredentialRequest {
  private callbackURL: string
  private requestedCredentials: ICredentialRequest[] = []

  // TODO INTERFACE
  public static create(args: {
    callbackURL: string,
    requestedCredentials: Array<{type: string[], constraints: IConstraint[]}>
  }): CredentialRequest {
    const cr = new CredentialRequest()
    cr.setCallbackURL(args.callbackURL)
    args.requestedCredentials.forEach((req) => cr.addRequestedClaim(req))
    return cr
  }

  public setCallbackURL(url: string) {
    this.callbackURL = url
  }

  public getCallbackURL(): string {
    return this.callbackURL
  }

  public getRequestedCredentialTypes(): string[][] {
    return this.requestedCredentials.map((credential) => credential.type)
  }

  public applyConstraints(credentials: ISignedCredentialAttrs[]): ISignedCredentialAttrs[] {
    return credentials.filter((credential) => {
      const relevantConstraints = this.requestedCredentials.find((section) =>
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

  private addRequestedClaim({constraints, type}: {type: string[], constraints: IConstraint[]}) {
    const credConstraints = {
      and: [
        { '==': [true, true] },
        ...constraints
      ]
    }

    this.requestedCredentials.push({ type, constraints: credConstraints })
  }
}

// TODO MOVE
export const constraintFunctions: IExposedConstraintFunctions = {
  is: (field: string, value: string) => assembleStatement('==', field, value),
  not: (field: string, value: string) => assembleStatement('!=', field, value),
  greater: (field: string, value: comparable) => assembleStatement('>', field, value),
  smaller: (field: string, value: comparable) => assembleStatement('<', field, value)
}

const assembleStatement = (operator: string, field: string, value: string | comparable): IConstraint => {
  return { [operator]: [{ var: field }, value] } as IConstraint
}
