export function getCurrentUrl() {
  return window.location.href
}

export function getQueryStringParameter(name: string, url?: string) {
  if (!url) url = getCurrentUrl()
  name = name.replace(/[[\]]/g, '\\$&')
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`, 'i')
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

export function getSecondLevelDomainAt(position: number) {
  const hostname = window.location.hostname
  return hostname.split('.')[position]
}

export function getAccountName() {
  let accountName = getQueryStringParameter('an')
  if (!accountName) {
    accountName = getSecondLevelDomainAt(0)
  }
  return accountName
}
