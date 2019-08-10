import { ContextTransformer, JsonLdContextEntry } from './types'
import { locallyCachedContexts } from './localCache'

/**
 * {@link ContextTransformer} that attempts to replace any URLs in the context array
 *  with entries from a local cache.
 *  @note Does not recurse!
 *  @param context - The context to be transformed
 *  @returns - Context with urls replaced with cached vocabularies, or left unmodified
 *    if no local record is found
 */

export const cachedContextTransformer: ContextTransformer = context => {
  const arrayContext: JsonLdContextEntry[] = [].concat(context)

  return arrayContext.map(entry => {
    if (typeof entry === 'string') {
      return locallyCachedContexts[entry] || entry
    }

    return entry
  })
}
