import { JsonLdObject } from '../../../validation/jsonLdValidator'

export interface IPublicKeySectionAttrs extends JsonLdObject {
  id: string
  type: string
}

export type PublicKeySectionAttrs = IPublicKeySectionAttrs & PublicKeyForm

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

export type IAuthenticationSectionAttrs = PublicKeySectionAttrs | string

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
            case PublicKeyRepresentationType.Hex: return 'hex'
            case PublicKeyRepresentationType.Base58: return "base58"
            case PublicKeyRepresentationType.Base64: return "base64"
            case PublicKeyRepresentationType.Pem: return "base64"
            case PublicKeyRepresentationType.Eth: return "hex"
            default: throw new Error("invalid public key representation type")
        }
    }

    export function has(str: string): boolean {
        switch (str) {
            case PublicKeyRepresentationType.Hex:
            case PublicKeyRepresentationType.Base58:
            case PublicKeyRepresentationType.Base64:
            case PublicKeyRepresentationType.Pem:
            case PublicKeyRepresentationType.Eth: return true
            default: return false
        }
    }

    export function fromStr(str: string): PublicKeyRepresentationType {
        switch (str) {
            case PublicKeyRepresentationType.Hex: return PublicKeyRepresentationType.Hex
            case PublicKeyRepresentationType.Base58: return PublicKeyRepresentationType.Base58
            case PublicKeyRepresentationType.Base64: return PublicKeyRepresentationType.Base64
            case PublicKeyRepresentationType.Pem: return PublicKeyRepresentationType.Pem
            case PublicKeyRepresentationType.Eth: return PublicKeyRepresentationType.Eth
            default: throw new Error("invalid public key representation type")
        }
    }

    export function keyToRep (typ: PublicKeyRepresentationType): (material: string) => PublicKeyForm {
        switch (typ) {
            case PublicKeyRepresentationType.Hex: return (material) => ({publicKeyHex: material});
            case PublicKeyRepresentationType.Base58: return (material) => ({publicKeyBase58: material})
            case PublicKeyRepresentationType.Base64: return (material) => ({publicKeyBase64: material})
            case PublicKeyRepresentationType.Pem: return (material) => ({publicKeyPem: material})
            case PublicKeyRepresentationType.Eth: return (material) => ({ethereumAddress: material})
            default: return (x: never) => {throw new Error("invalid public key representation type")}
        }
    }

    export function KeyToBuffer (typ: PublicKeyRepresentationType): (material: string) => Buffer {
        return (material) => Buffer.from(material, toBufferEncoding(typ))
    }
}

interface Hex extends JsonLdObject { publicKeyHex: string }
interface Base58 extends JsonLdObject { publicKeyBase58: string }
interface Base64 extends JsonLdObject { publicKeyBase64: string }
interface Pem extends JsonLdObject { publicKeyPem: string }
interface Eth extends JsonLdObject { ethereumAddress: string }

export type PublicKeyForm = Hex | Base58 | Base64 | Pem | Eth
