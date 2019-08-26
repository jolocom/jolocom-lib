
import { IPublicKeyAttrs, PublicKeyRepresentationType, PublicKeyForm} from './types'

export class PublicKeyRepresentation implements IPublicKeyAttrs {
    private readonly _representation: PublicKeyRepresentationType
    private readonly _keyMaterial: string

    constructor (representation: PublicKeyRepresentationType, keyMaterial: string) {
        this._representation = representation
        this._keyMaterial = keyMaterial
    }

    public get representation(): PublicKeyRepresentationType {
        return this._representation
    }

    public get keyMaterial(): string {
        return this._keyMaterial
    }

    public toJSON(): PublicKeyForm {
        return this.getJson(this._representation, this._keyMaterial)
    }

    public static fromJSON(json: PublicKeyForm): PublicKeyRepresentation {
        return new PublicKeyRepresentation(PublicKeyRepresentationType.fromStr(Object.keys(json)[0]), Object.values(json)[0])

    }

    public toBuffer(): Buffer {
        return Buffer.from(this._keyMaterial, PublicKeyRepresentationType.toBufferEncoding(this._representation))
    }

    private getJson(rep: PublicKeyRepresentationType, material: string): PublicKeyForm {
        switch (rep) {
            case PublicKeyRepresentationType.Hex:
                return {publicKeyHex: material}
            case PublicKeyRepresentationType.Base58:
                return {publicKeyBase58: material}
            case PublicKeyRepresentationType.Base64:
                return {publicKeyBase64: material}
            case PublicKeyRepresentationType.Pem:
                return {publicKeyPem: material}
            case PublicKeyRepresentationType.Eth:
                return {ethereumAddress: material}
        }
    }
}
