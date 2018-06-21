import { DidDocument } from './didDocument'

const rawPublicKey = Buffer.from('03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479')
const ddo = new DidDocument().fromPublicKey(rawPublicKey)

console.log(ddo)