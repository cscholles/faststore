import { injectIntl, IntlShape } from 'react-intl'
import upperFirst from 'lodash/upperFirst'

// interface IntlMessage {
//   id: string
// }

// interface IntlShape {
//   locale: string
//   formatMessage: (object: IntlMessage, extra?: object) => string
// }

let globalIntl: IntlShape | null = null

export const currenciesCode: Record<string, string> = {
  pt: 'BRL',
  en: 'USD',
  es: 'ARS',
}

export const IntlSaveObject = (intl: IntlShape) => {
  globalIntl = intl
  return null
}

// export const IntlSaveComponent = injectIntl(IntlSaveObject)

export function getIntlMessage(
  id: string,
  extraContext?: any, // TODO: can we be more specific on this type?
  intl?: IntlShape
): string {
  const intlObject = intl || globalIntl
  if (!intlObject || !id) {
    return '<no error message provided>'
  }

  return intlObject.formatMessage({ id }, extraContext)
}

export function getIntlLocale(intl?: IntlShape) {
  const intlObject = intl || globalIntl
  if (!intlObject) {
    return null
  }

  return intlObject.locale
}

export function addI18nPrefix(prefix = '', key = '') {
  return prefix + upperFirst(key)
}
