import { JoloDidMethod } from './jolo'
import { LocalDidMethod } from './local'

export const didMethods = {
  jolo: new JoloDidMethod(),
  jun: new LocalDidMethod()
}
