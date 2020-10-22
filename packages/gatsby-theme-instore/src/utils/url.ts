export function getCurrentUrl(): string {
  return window.location.href
}

function fullRedirectToUrl(url: string, extraParams: AnyObject) {
  const currentUrl = url || getCurrentUrl()

  const newUrl = currentUrl

  window.location.href = newUrl
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

export function convertDictionaryToQueryString(obj: AnyObject) {
  if (!obj) return ''

  const str = []

  for (const p in obj) {
    if (obj.hasOwnProperty(p) && obj[p] != null) {
      str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`)
    }
  }

  return str.join('&')
}

export function redirectToVersion(version: string) {
  fullRedirectToUrl('', version ? { VTEX_APP_VERSION: version } : undefined)
}

export function updateQueryStringParameter(
  uri: string,
  key: string,
  value: string
) {
  const uriParts = uri.split('#', 2)
  const re = new RegExp(`([?&])${key}=.*?(&|$)`, 'i')
  const separator = uri.indexOf('?') !== -1 ? '&' : '?'
  if (uriParts[0].match(re)) {
    return uriParts[0].replace(re, `$1${key}=${value}$2`)
  }

  return `${uriParts[0] + separator + key}=${value}#${uriParts[1] || ''}`
}
