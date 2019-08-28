import { JsonLdObject } from '../../../validation/jsonLdValidator'

export interface IPublicKeySectionAttrsV013 extends JsonLdObject {
  id: string
  type: string
  controller: string
}

export interface IPublicKeySectionAttrsV0 extends JsonLdObject {
    id: string
    type: string
    owner: string
}

export type IPublicKeySectionAttrs = IPublicKeySectionAttrsV0 | IPublicKeySectionAttrsV013
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

type Hex = { publicKeyHex: string } & JsonLdObject
type Base58 = { publicKeyBase58: string } & JsonLdObject
type Base64 = { publicKeyBase64: string } & JsonLdObject
type Pem = { publicKeyPem: string } & JsonLdObject
type Eth = { ethereumAddress: string } & JsonLdObject

export type PublicKeyForm = Hex | Base58 | Base64 | Pem | Eth

// this is really abusing typescript, and is probably why assertions aren't liked
const customObject = <T extends JsonLdObject, V extends keyof JsonLdObject>(key: string) => (value: V): T => ({[key]: value}) as unknown as T

const Hex = (key: string) => customObject<Hex, string>(PublicKeyRepresentationType.Hex)(key)
const Base58 = (key: string) => customObject<Base58, string>(PublicKeyRepresentationType.Base58)(key)
const Base64 = (key: string) => customObject<Base64, string>(PublicKeyRepresentationType.Base64)(key)
const Pem = (key: string) => customObject<Pem, string>(PublicKeyRepresentationType.Pem)(key)
const Eth = (key: string) => customObject<Eth, string>(PublicKeyRepresentationType.Eth)(key)

export namespace PublicKeyRepresentationType {
    export function toBufferEncoding (rep: PublicKeyRepresentationType): string {
        switch (rep) {
            case PublicKeyRepresentationType.Hex: return 'hex'
            case PublicKeyRepresentationType.Base58: return "base58"
            case PublicKeyRepresentationType.Base64: return "base64"
            case PublicKeyRepresentationType.Pem: return "base64"
            case PublicKeyRepresentationType.Eth: return "hex"
            default: throw new Error("invalid public key representation type: " + rep)
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
            default: throw new Error("invalid public key representation type: " + str)
        }
    }

    export function keyToRep (typ: PublicKeyRepresentationType): (material: string) => PublicKeyForm {
        switch (typ) {
            case PublicKeyRepresentationType.Hex: return Hex;
            case PublicKeyRepresentationType.Base58: return Base58;
            case PublicKeyRepresentationType.Base64: return Base64
            case PublicKeyRepresentationType.Pem: return Pem
            case PublicKeyRepresentationType.Eth: return Eth
            default: return (x: never) => {throw new Error("invalid public key representation type: " + typ)}
        }
    }

    export function keyToBuffer (typ: PublicKeyRepresentationType): (material: string) => Buffer {
        return (material) => Buffer.from(material, toBufferEncoding(typ))
    }

    export function formToBuffer (form: PublicKeyForm): Buffer {
        return keyToBuffer(formType(form))(formContent(form))
    }

    export function formType (form: PublicKeyForm): PublicKeyRepresentationType {
        const ks = Object.keys(form).filter(has)[0]
        return fromStr(ks[0])
    }

    export function formContent (form: PublicKeyForm): string {
        return Object.values(form)[0] as string

    }

    export function extractFromJson (json: PublicKeyForm): PublicKeyForm {
        const ks = Object.keys(json).filter(has)
        return keyToRep(fromStr(ks[0]))(json[ks[0]] as string)
    }
}
