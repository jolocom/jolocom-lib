const isNode = require('detect-node')

export const isRunningInNode = (): boolean => {
  return isNode
}
