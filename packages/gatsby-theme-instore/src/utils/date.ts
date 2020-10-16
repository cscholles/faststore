import isNumber from 'lodash/isNumber'

const MINUTE_IN_MS = 60 * 1000
const HOUR_IN_MS = 60 * MINUTE_IN_MS
const DAY_IN_MS = 24 * HOUR_IN_MS
const MONTH_IN_MS = 30 * DAY_IN_MS
const YEAR_IN_MS = 365 * DAY_IN_MS

export function leftPad(number: number, len: number = 2, ch: string = '0') {
  const str = `${number}`
  len = len - str.length
  if (len <= 0) return str
  if (!ch && ch !== '0') ch = ' '
  ch = `${ch}`
  let pad = ''
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (len & 1) pad += ch
    len >>= 1
    if (len) ch += ch
    else break
  }

  return pad + str
}

export function diffInMiliseconds(
  dateA: Date = new Date(),
  dateB: Date = new Date()
): number {
  return dateA.getMilliseconds() - dateB.getMilliseconds()
}

export function diffInMinutes(
  dateA: Date = new Date(),
  dateB: Date = new Date()
): number {
  return Math.round(
    ((diffInMiliseconds(dateA, dateB) % 86400000) % 3600000) / 60000
  )
}

export function diffInDays(
  dateA: Date = new Date(),
  dateB: Date = new Date()
): number {
  return Math.round(diffInMiliseconds(dateA, dateB) / DAY_IN_MS)
}

export function minDiffInMinutes(
  dateA: Date = new Date(),
  dateB: Date = new Date()
): number {
  return Math.round(diffInMiliseconds(dateA, dateB) / MINUTE_IN_MS)
}

export function minDiffInHours(
  dateA: Date = new Date(),
  dateB: Date = new Date()
): number {
  return Math.floor(diffInMiliseconds(dateA, dateB) / HOUR_IN_MS)
}

export function minDiffInDays(
  dateA: Date = new Date(),
  dateB: Date = new Date()
): number {
  return Math.floor(diffInMiliseconds(dateA, dateB) / DAY_IN_MS)
}

export function minDiffInMonth(
  dateA: Date = new Date(),
  dateB: Date = new Date()
): number {
  return Math.floor(diffInMiliseconds(dateA, dateB) / MONTH_IN_MS)
}

export function minDiffInYear(
  dateA: Date = new Date(),
  dateB: Date = new Date()
): number {
  return Math.floor(diffInMiliseconds(dateA, dateB) / YEAR_IN_MS)
}

export function getDiffInEstimate(
  dateA: Date = new Date(),
  dateB: Date = new Date()
): string {
  const years = minDiffInYear(dateA, dateB)
  if (years > 0) {
    return `${years}Y`
  }

  const months = minDiffInMonth(dateA, dateB)
  if (months > 0) {
    return `${months}M`
  }

  const days = minDiffInDays(dateA, dateB)
  if (days > 0) {
    return `${days}d`
  }

  const hours = minDiffInHours(dateA, dateB)
  if (hours > 0) {
    return `${hours}h`
  }

  const minutes = diffInMinutes(dateA, dateB)
  if (minutes > 0) {
    return `${minutes}m`
  }

  return '0m'
}

export function formatTime(date: Date, forceUTC: boolean = false): string {
  /* The following line allow to mock hours with mockDate */
  let utcHours = date.getUTCHours() - date.getTimezoneOffset() / 60.0
  utcHours = utcHours < 0 ? 24 + utcHours : utcHours
  const hours = forceUTC ? leftPad(date.getUTCHours()) : leftPad(utcHours)

  const mins = forceUTC
    ? leftPad(date.getUTCMinutes())
    : leftPad(date.getMinutes())

  return `${hours}:${mins}`
}

export function formatSimpleDayMonthYear(
  date: Date,
  forceUTC: boolean = false
): string {
  const day = forceUTC ? leftPad(date.getUTCDate()) : leftPad(date.getDate())

  const month = forceUTC
    ? leftPad(date.getUTCMonth() + 1)
    : leftPad(date.getMonth() + 1)

  const year = forceUTC
    ? leftPad(date.getUTCFullYear(), 4)
    : leftPad(date.getFullYear(), 4)

  return `${day}/${month}/${year}`
}

export function formatSimpleDate(
  date: Date,
  forceUTC: boolean = false,
  includeTime: boolean = true,
  includeYear: boolean = false
): string {
  const day = forceUTC ? leftPad(date.getUTCDate()) : leftPad(date.getDate())

  const month = forceUTC
    ? leftPad(date.getUTCMonth() + 1)
    : leftPad(date.getMonth() + 1)

  const year = forceUTC
    ? leftPad(date.getUTCFullYear(), 4)
    : leftPad(date.getFullYear(), 4)

  const time = formatTime(date, forceUTC)

  return `${day}/${month}${includeYear ? `/${year}` : ''}${
    includeTime ? ` ${time}` : ''
  }`
}

export function formatInternacionalDate(date: Date): string {
  const year = leftPad(date.getFullYear())
  const day = leftPad(date.getDate())
  const month = leftPad(date.getMonth() + 1)
  return `${year}-${month}-${day}`
}

export function getDateWithoutTime(date: Date): Date {
  return new Date(formatInternacionalDate(date))
}

export function normalizeHoursOfDay(date: Date): Date {
  const normalizedDate = new Date(date.getTime())
  normalizedDate.setUTCHours(12, 0, 0, 0)
  return normalizedDate
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * MINUTE_IN_MS)
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_IN_MS)
}

export function subtractMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() - minutes * MINUTE_IN_MS)
}

export function subtractDays(date: Date, days: number): Date {
  return new Date(date.getTime() - days * DAY_IN_MS)
}

export function addAvailableDaysToDate(
  date: Date,
  availableDaysToAdd: number
): Date {
  const estimateDate = normalizeHoursOfDay(date) // Copy date ignoring hours

  const dayIndex = estimateDate.getDay() // 0: Sunday -> 6: Saturday

  let remainingDaysToGetToAWorkDay = 0
  if (dayIndex === 0 || dayIndex === 6) {
    remainingDaysToGetToAWorkDay = dayIndex === 0 ? 1 : 2
  }

  const numberOfWeekends = Math.floor(
    (availableDaysToAdd - 1 + (dayIndex % 6 || 1)) / 5
  )

  const numberOfDaysToAdd =
    availableDaysToAdd + remainingDaysToGetToAWorkDay + numberOfWeekends * 2

  return addDays(estimateDate, numberOfDaysToAdd)
}

export function convertBusinnesDaysToDays(businessDays: number): number {
  const start = new Date()
  const end = addAvailableDaysToDate(start, businessDays)
  return diffInDays(end, start)
}
