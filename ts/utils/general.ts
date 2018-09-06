const isNode = require('detect-node')

export const areCredTypesEqual = (first: string[], second: string[]): boolean => {
  return first.every((el, index) => el === second[index])
}

export const isRunningInNode = () : boolean => {
  return isNode
}