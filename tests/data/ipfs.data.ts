export const testHash = 'Qm12345'

export const mockBaseUri = 'http://localhost:5001'
export const mockAddUrl = `${mockBaseUri}/api/v0/add?pin=true`
export const mockCatUrl = `${mockBaseUri}/api/v0/cat/${testHash}`
export const mockPinUrl = `${mockBaseUri}/api/v0/pin/rm?arg=${testHash}`

export const mockConfig = {
  host: 'localhost',
  port: 5001,
  protocol: 'http'
}