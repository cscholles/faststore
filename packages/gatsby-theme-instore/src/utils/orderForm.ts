import { getReduxStore } from '../redux/reduxStore'

interface OrderFormType {
  orderFormId: string
}

export function getOrderForm() {
  if (!getReduxStore()) {
    return null
  }
  return getReduxStore()?.getState().order
    ? getReduxStore()?.getState().order.orderForm
    : null
}

export function getOrderFormId(orderForm: OrderFormType): string | null {
  return orderForm ? orderForm.orderFormId : null
}
