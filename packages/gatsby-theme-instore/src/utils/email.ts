import trim from 'lodash/trim'

const ANONYMOUS_EMAIL_SUFFIX = '-anonymous@vtex.com'

export function isInStoreAnonymousEmail(email: string): boolean {
  return email ? email.indexOf(ANONYMOUS_EMAIL_SUFFIX) >= 0 : false
}

export function clearIfInStoreAnonymousEmail(email: string): string | null {
  return email && isInStoreAnonymousEmail(email) ? null : email
}

export function getNewAnonymousEmail(): string {
  return Date.now().toString() + ANONYMOUS_EMAIL_SUFFIX
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return emailRegex.test(email)
}

export function removeMailto(email: string = ''): string {
  email = String(email).toLowerCase()
  const mailto = 'mailto:'
  email = email.replace(mailto, '')
  return email
}

export function cleanUpEmail(email: string): string {
  return removeMailto(trim(email))
}
