// @ts-check

/**
 * Latitude/Longitude as Degrees, Minutes, Seconds
 * Ref: https://regexr.com/3qgn3
 *
 * Range check for minutes and seconds (0-59)
 * Max latitude 90:00:00, Max longitude 180:00:00
 *
 * Matches:
 * 90:00:00N 180:00:00E | 34:59:33S 179:59:59W | 00:00:00N 000:00:00W
 * 34:59:33.123S 179:59:59.999W | 90:00:00.000N 180:00:00.000E
 * 45:06:42:N:034:56:46:E (normalized format)
 *
 * Non-matches:
 * 91:00:00N 181:00:00E | 34:59:33Z 179:59:59W | 00:00:00N 181:00:00W
 * 90:00:00.001N 180:00:00.001E
 *
 * Groups:
 * [1] 90:00:00.000
 * [2] N
 * [3] 180:00:00.000
 * [4] E
 */
export const RE_DMS = /^((?:\d|[0-8][0-9])(?::(?:[0-5]\d|\d))(?::(?:[0-5]\d|\d)(?:\.\d{1,3})?)|90(?::00)(?::00)(?:\.0{1,3})?)(?:\s|:)?([NS])(?:\s|:)?((?:0?\d\d|0?0?\d|1[0-7]\d)(?::(?:[0-5]\d|\d))(?::(?:[0-5]\d|\d)(?:\.\d{1,3})?)|180(?::00)(?::00)(?:\.0{1,3})?)(?:\s|:)?([EW])$/

/**
 * Latitude/Longitude as Decimal Degrees
 * Ref: https://regexr.com/3ql84
 *
 * Latitude Matches:
 * 90 | -90 | 90.0 | 0 | 0.0 | 10.123456
 *
 * Longitude Matches:
 * 180 | -180 | 180.0 | 123.000000
 */

const DD_LAT =
  '-?(?:90(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,6})?))'

const DD_LON =
  '-?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[0-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,6})?))'

export const RE_DD_LAT = new RegExp(DD_LAT)

export const RE_DD_LON = new RegExp(DD_LON)

// Combined LAT & LONG, e.g. `90.0, -180.0`
export const RE_DD = new RegExp(`^(${DD_LAT}),\\s?(${DD_LON}$)`)
