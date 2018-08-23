import { createJolocomRegistry } from './jolocomRegistry'

console.log(createJolocomRegistry)
export const registries = {
  jolocom: {
    create: createJolocomRegistry
  }
}
