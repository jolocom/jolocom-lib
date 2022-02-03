// Formats a date object to an ISO  date time.
export const dateToIsoString = (date?: Date, trim = false) => {
  return date && date.toISOString().slice(0, -5) + 'Z'
}
