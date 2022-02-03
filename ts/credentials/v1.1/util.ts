import { v4 as uuidv4 } from 'uuid';

// Formats a date object to an ISO  date time.
export const dateToIsoString = (date?: Date, trim = false) => {
  return date && date.toISOString().slice(0, -5) + 'Z'
}

export const generateCredId = (): string => {
  return `urn:uuid:${uuidv4()}`
}