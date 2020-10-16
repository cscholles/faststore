import { getOrderForm } from './orderForm'

export const DEFAULT_CURRENCY = 'R$'

export function getCurrencySymbol() {
  const orderForm = getOrderForm()
  return (
    (orderForm &&
      orderForm.storePreferencesData &&
      orderForm.storePreferencesData.currencySymbol) ||
    DEFAULT_CURRENCY
  )
}
