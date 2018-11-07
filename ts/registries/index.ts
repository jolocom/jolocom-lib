import { createJolocomRegistry } from './jolocomRegistry'

/* Aggregates all registries supported by the library */

export const registries = {
  jolocom: {
    create: createJolocomRegistry,
  },
}
