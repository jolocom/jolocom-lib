export const dateToISOString = (date?: Date): string =>
  date ? date.toISOString() : ''

export const isoStringToDate = (dateStr?: string) =>
  (dateStr && new Date(dateStr)) || ''

export const withDefaultValue = <T>(def: T) => (value?: T) => value || def
