import * as jsonlogic from 'json-logic-js'
import { plainToClass, classToPlain, Expose } from 'class-transformer'
import {
  ICredentialRequestAttrs,
  Comparable,
  IExposedConstraintFunctions,
  ICredentialRequest,
  IConstraint,
  Operator
} from './credentialRequestTypes'
import { ISignedCredentialAttrs } from '../credentials/signedCredential/types'

/* Class representing a credential request, includes requested types and constraints. Encodable in JWT */

@Expose()
export class CredentialRequest {
  private callbackURL: string
  private credentialRequirements: ICredentialRequest[] = []

  public getCallbackURL(): string {
    return this.callbackURL
  }

  public getRequestedCredentials(): ICredentialRequest[] {
    return this.credentialRequirements
  }

  /*
   * @description - Maps over internal data structure and aggregates
   *  all requested credential types
   * @return{Array<string[]>} - Array of types, e.g. [['Credential', 'proofOfEmailCredential']]
   */

  public getRequestedCredentialTypes(): string[][] {
    return this.credentialRequirements.map(credential => credential.type)
  }

  /*
   * @description - Filters the passed credentials based on constraints defined on instance
   * @param credentials - Array of verifiable credentials in JSON form
   * @return{Array<string[]>} - Array of verifiable credentials that satisfy the requirements as JSON
   */

  public applyConstraints(credentials: ISignedCredentialAttrs[]): ISignedCredentialAttrs[] {
    return credentials.filter(credential => {
      const relevantConstraints = this.credentialRequirements.find(section =>
        areCredTypesEqual(section.type, credential.type)
      )

      /* When validating against empty constraints json-logic returns false, we need true */

      if (!relevantConstraints.constraints.length) {
        return credential
      }

      /* AND all requirements */

      const combinedRequirements = { and: relevantConstraints.constraints }

      if (relevantConstraints) {
        return jsonlogic.apply(combinedRequirements, credential)
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

/* Exposes predefined constraint functions for easier assembly */

export const constraintFunctions: IExposedConstraintFunctions = {
  is: (field: string, value: string) => assembleStatement('==', field, value),
  not: (field: string, value: string) => assembleStatement('!=', field, value),
  greater: (field: string, value: Comparable) => assembleStatement('>', field, value),
  smaller: (field: string, value: Comparable) => assembleStatement('<', field, value)
}

/*
   * @description - Helper function to assemble a valid json-logic statement
   * @param operator - Comparison function, i.e. ==, !=, <, >
   * @param field - Credential field, e.g. 'issued', 'claim.id'
   * @param value - Value to compare to, currently static
   * @return{Object} - JSON encoded conditional statement
   */

const assembleStatement = (operator: Operator, field: string, value: string | Comparable): IConstraint => {
  return { [operator]: [{ var: field }, value] } as IConstraint
}

/*
   * @description - Compares two arrays by going through the elements
   * @param first - First array to compare
   * @param second - Second array to compare
   * @return{boolean} - Whether arrays are equal
   */

const areCredTypesEqual = (first: string[], second: string[]): boolean => {
  return first.every((el, index) => el === second[index])
}
