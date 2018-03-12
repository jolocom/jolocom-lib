import * as moment from 'moment'

export function isExpirationDateValid({expires} : {expires: string}) : boolean {
  const now = moment.utc()
  const expiry = moment.utc(expires, moment.ISO_8601)

  return moment.duration(expiry.diff(now)).asHours() > 1
}
