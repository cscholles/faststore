import { currenciesCode } from './i18n'

function formatPricePtFallback(price: number) {
  return price
    .toFixed(2)
    .replace('.', ',')
    .replace(/(\d)(?=(\d{3})+,)/g, '$1.')
    .trim()
}

// TODO: check which type is more appropriate
export function formatPrice(price: number, intl: any) {
  if (!intl || !intl.formatNumber) {
    return formatPricePtFallback(price)
  }

  const currencyCode = currenciesCode[intl.locale]
  const newPrice = intl.formatNumber(price, {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'code',
    minimumFractionDigits: 2,
  })

  return newPrice
    .toString()
    .replace(currencyCode, '') // return only the value
    .trim()
}

/**
 * add doc
 * @param price
 * The price in cents
 * @returns
 * The price as a decimal value
 *
 * @example
 * getFriendlyPrice(12599)
 * > 125.99
 */
export function getFriendlyPrice(price: number) {
  return price / 100
}
