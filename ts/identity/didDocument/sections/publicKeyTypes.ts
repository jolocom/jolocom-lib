
import { PublicKeyRepresentationType, PublicKeyForm} from './types'

export class PublicKeyRepresentation<T extends PublicKeyForm> {
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

    public static fromJSON(json: PublicKeyForm) {
        const keys = Object.keys(json)
        const key = keys[0]
        if (keys.length !== 1 || !PublicKeyRepresentationType.has(key)) {
            throw new Error("invalid public key representation format")
        }

        return new PublicKeyRepresentation(PublicKeyRepresentationType.fromStr(key), json[key] as string)
    }

    public toBuffer(): Buffer {
        return Buffer.from(this._keyMaterial, PublicKeyRepresentationType.toBufferEncoding(this._representation))
    }

    private getJson(rep: PublicKeyRepresentationType, material: string): PublicKeyForm {
        return PublicKeyRepresentationType.keyToRep(rep)(material)
    }
}
