export function getCurrentUrl(): string {
  return window.location.href
}

export function getQueryStringParameter(
  name: string,
  url?: string
): string | null {
  if (!url) url = getCurrentUrl()
  name = name.replace(/[[\]]/g, '\\$&')
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`, 'i')
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

export function getSecondLevelDomainAt(position: number): string {
  const hostname = window.location.hostname
  return hostname.split('.')[position]
}

export function getAccountName(): string {
  let accountName = getQueryStringParameter('an')
  if (!accountName) {
    accountName = getSecondLevelDomainAt(0)
  }
  return accountName
}

export function getCleanUrl(url: string): string {
  if (!url) {
    return url
  }

  return url.indexOf('//') !== -1
    ? url.split('//')[1].split('?')[0].split('#')[0]
    : url.split('?')[0].split('#')[0]
}
