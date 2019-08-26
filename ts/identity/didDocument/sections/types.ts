import { JsonLdObject } from '../../../validation/jsonLdValidator'
import { PublicKeyRepresentation } from './publicKeyTypes';

export interface IPublicKeySectionAttrs extends JsonLdObject {
  id: string
  type: string
  key: IPublicKeyAttrs
}

export interface IAuthenticationSectionAttrsv0 extends JsonLdObject {
  publicKey: string
  type: string
}

export interface IServiceEndpointSectionAttrs extends JsonLdObject {
  id: string
  type: string
  serviceEndpoint: string
  description: string
}

export type IAuthenticationSectionAttrs = IPublicKeySectionAttrs | string

export enum PublicKeyRepresentationType {
    Hex = "publicKeyHex",
    Base64 = "publicKeyBase64",
    Base58 = "publicKeyBase58",
    Pem = "publicKeyPem",
    Eth = "ethereumAddress"
}

export namespace PublicKeyRepresentationType {
    export function toBufferEncoding (rep: PublicKeyRepresentationType): string {
        switch (rep) {
            case PublicKeyRepresentationType.Hex:
                return 'hex'
            case PublicKeyRepresentationType.Base58:
                return "base58"
            case PublicKeyRepresentationType.Base64:
                return "base64"
            case PublicKeyRepresentationType.Pem:
                return "base64"
            case PublicKeyRepresentationType.Eth:
                return "hex"
        }
    }

    export function fromStr(str: srting): PublicKeyRepresentationType {
        switch (rep) {
            case PublicKeyRepresentationType.Hex:
                return PublicKeyRepresentationType.Hex
            case PublicKeyRepresentationType.Base58:
                return PublicKeyRepresentationType.Base58
            case PublicKeyRepresentationType.Base64:
                return PublicKeyRepresentationType.Base64
            case PublicKeyRepresentationType.Pem:
                return PublicKeyRepresentationType.Pem
            case PublicKeyRepresentationType.Eth:
                return PublicKeyRepresentationType.Eth
        }
    }
}


export interface IPublicKeyAttrs extends JsonLdObject {
    representation: PublicKeyRepresentationType,
    keyMaterial: string
}

type Hex { publicKeyHex: string }
type Base64 { publicKeyBase64: string }
type Base58 { publicKeyBase58: string}
type Pem { publicKeyPem: string}
type Eth { ethereumAddress: string }

export type PublicKeyForm = Hex | Base64 | Base58 | Pem | Eth

export type FilterKeys<Base, Condition> = {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never
}

export type AllowedKeys<Base, Condition> = FilterKeys<Base, Condition>[keyof Base]

export type SubType<Base, Condition> = Pick<Base, AllowedKeys>>
