import { publicProfileCredJSON } from "./identity";
import { ISignedCredentialAttrs } from "../../ts/credentials/signedCredential/types";

export const msgToSign = Buffer.from('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 'hex')
export const msgSignature = Buffer.from('f46ffee01f80b8b861e364f46b1f971599d7597949d76f5883fbd306aa34bb8132b31f08cf037eabe79c7de2506f75b9a08924eb685853ceab57f92dc3fd7e29', 'hex')
export const incorrectSignature = Buffer.from('f46ffee01f80b8b861e364f46b1f971599d7597949d76f5883fbd306aa34bb8132b31f08cf037eabe79c7de2506f75b2a08924eb685853ceab57f92dc3fd7e29', 'hex')
export const invalidtSignature = Buffer.from('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFd76f5883fbd306aa34bb8132b31f08cf037eabe79c7de2506f75b2a08924eb685853ceab57f92dc3fd7e29', 'hex')
export const invalidMsgToSign = Buffer.from('this is not a hash')
export const credentialDigest = Buffer.from('967138219ad8311be0e951f11ac517cdec8fbb1603abaec8fa2ca588cdc9a164', 'hex')

/* Swapping the vaild signature value with a valid signature from another message */

export const corruptedSignedCredentialJSON = {
  ...publicProfileCredJSON,
  proof: {
    ...publicProfileCredJSON.proof,
    signatureValue: msgSignature.toString('hex')
  }
} as ISignedCredentialAttrs
