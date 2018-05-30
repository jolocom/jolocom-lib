import { plainToClass, classToPlain } from 'class-transformer'
import * as jsonlogic from 'json-logic-js'
import { TokenSigner, decodeToken } from 'jsontokens'
import {
  ICredentialRequestAttrs,
  constraintFunc, comparable,
  comparableConstraintFunc,
  IExposedConstraintFunctions,
  ICredentialRequest,
  IConstraint
} from './types'
import { IVerifiableCredentialAttrs } from '../credentials/verifiableCredential/types';

export class CredentialRequest {
  private requesterIdentity: string
  private callbackURL: string
  private requestedCredentials: ICredentialRequest[] = []

  public setRequesterIdentity(requesterIdentity: string) {
    this.requesterIdentity = requesterIdentity
  }

  public setCallbackURL(url: string) {
    this.callbackURL = url
  }

  public addRequestedClaim(type: string[], constraints: IConstraint[]) {
    const credConstraints = {
      and: [
        { '==': [true, true] },
        ...constraints
      ]
    }

    this.requestedCredentials.push({ type, constraints: credConstraints })
  }

  public applyConstraints(credentials: IVerifiableCredentialAttrs[]): IVerifiableCredentialAttrs[] {
    return credentials.filter((credential) => {
      const relevantConstraints = this.requestedCredentials.find((section) =>
        this.areCredTypesEqual(section.type, credential.type)
      )

      if (relevantConstraints) {
        return jsonlogic.apply(relevantConstraints.constraints, credential)
      }
    })
  }

  public toJWT(privKey: Buffer): string {
    const hexKey = privKey.toString('hex')

    const token = {
      iat: Date.now(),
      ...this.toJSON()
    }
    return new TokenSigner('ES256K', hexKey).sign(token)
  }

  public fromJWT(jwt: string): CredentialRequest {
    const { payload } = decodeToken(jwt)
    return this.fromJSON(payload)
  }

  public toJSON(): ICredentialRequestAttrs {
    return classToPlain(this) as ICredentialRequestAttrs
  }

  public fromJSON(json: ICredentialRequestAttrs): CredentialRequest {
    return plainToClass(CredentialRequest, json)
  }

  private areCredTypesEqual(first: string[], second: string[]): boolean {
    return first.every((el, index) => el === second[index])
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
