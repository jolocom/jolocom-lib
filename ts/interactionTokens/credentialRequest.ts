import * as jsonlogic from 'json-logic-js'
import { plainToClass, classToPlain, Expose, Exclude } from 'class-transformer'
import {
  ICredentialRequestAttrs,
  Comparable,
  IExposedConstraintFunctions,
  ICredentialRequest,
  IConstraint,
  Operator,
} from './interactionTokens.types'
import { ISignedCredentialAttrs } from '../credentials/signedCredential/types'

/**
 * @class
 * Class representing a credential request. Encodable in JWT
 */

@Exclude()
export class CredentialRequest {
  private _callbackURL: string
  private _credentialRequirements: ICredentialRequest[] = []

  /**
   * Get the credential requirements encoded in payload
   * @example `console.log(request.credentialRequirements) // [{ type: ['Credential', ...], constraints: [...]}]`
   */

  @Expose()
  get credentialRequirements() {
    return this._credentialRequirements
  }

  /**
   * Set the credential requirements encoded in payload
   * @example `request.credentialRequirements = [{ type: ['Credential', ...], constraints: [...]}]`
   */

  set credentialRequirements(requirements) {
    this._credentialRequirements = requirements
  }

  /**
   * Get the callback url encoded in the payload
   * @example `console.log(credentialRequest.callbackURL) // 'http://example.com/offer/share'`
   */

  @Expose()
  get callbackURL(): string {
    return this._callbackURL
  }

  /**
   * Set the callback url encoded in the payload
   * @example `credentialRequest.callbackURL = 'http://example.com/offer/share'`
   */

  set callbackURL(callback: string) {
    this._callbackURL = callback
  }

  /**
   *  Maps over internal data structure and aggregates all requested credential types
   * @example `console.log(credentialRequest.requestedCredentialTypes) // [['Credential', 'ProofOfNameCredential'], ...]`
   */

  get requestedCredentialTypes(): string[][] {
    return this.credentialRequirements.map(credential => credential.type)
  }

  /**
   * Filters the passed credentials based on constraints defined on instance
   * @param credentials - Array of verifiable credentials in JSON form
   * @return Array of {@link SignedCredential} that satisfy the requirements, as JSON
   * @example `const validCredentials = credentialRequest.applyConstraints(allCredentials)`
   */

  public applyConstraints(
    credentials: ISignedCredentialAttrs[],
  ): ISignedCredentialAttrs[] {
    return credentials.filter(credential => {
      const relevantConstraints = this.credentialRequirements.find(section =>
        areCredTypesEqual(section.type, credential.type),
      )

      if (!relevantConstraints) {
        return false
      }

      /* When validating against empty or undefined constraints json-logic returns false, we need true */
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

  /**
   * Serializes the {@link CredentialRequest} as JSON-LD
   */

  public toJSON(): ICredentialRequestAttrs {
    return classToPlain(this) as ICredentialRequestAttrs
  }

  /**
   * Instantiates a {@link CredentialRequest} from it's JSON form
   * @param json - JSON encoded credential request
   */

  public static fromJSON(json: ICredentialRequestAttrs): CredentialRequest {
    return plainToClass(CredentialRequest, json)
  }
}

/* Exposes predefined constraint functions for easier assembly */

export const constraintFunctions: IExposedConstraintFunctions = {
  is: (field: string, value: string) => assembleStatement('==', field, value),
  not: (field: string, value: string) => assembleStatement('!=', field, value),
  greater: (field: string, value: Comparable) =>
    assembleStatement('>', field, value),
  smaller: (field: string, value: Comparable) =>
    assembleStatement('<', field, value),
}

/**
 * Helper function to assemble a valid json-logic statement
 * @param operator - Comparison function, i.e. ==, !=, <, >
 * @param field - Credential field, e.g. 'issued', 'claim.id'
 * @param value - Value to compare to, currently static
 * @ignore
 */

const assembleStatement = (
  operator: Operator,
  field: string,
  value: string | Comparable,
): IConstraint => {
  return { [operator]: [{ var: field }, value] } as IConstraint
}

/**
 * Compares two arrays by going through the elements
 * @param first - First array to compare
 * @param second - Second array to compare
 * @ignore
 */

const areCredTypesEqual = (first: string[], second: string[]): boolean => {
  return first.every((el, index) => el === second[index])
}
