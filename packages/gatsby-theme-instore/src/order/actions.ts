import { Router } from 'react-router'
import { push } from 'react-router-redux'
import uuid from 'uuid'

import { PROJECT_NAME } from '../redux/common'
import * as EmailUtils from '../utils/email'
import * as CustomEvent from '../utils/customEvent'
import { getStepById, getStepsByGroup } from './steps'

// FIXME: should we have a "constants" module?
// import { DEFAULT_GIFT_CARD_PROVIDER } from 'constants/CheckoutConstants'
export const DEFAULT_GIFT_CARD_PROVIDER = 'VtexGiftCard'

/** ACTION TYPES **/

const NAME = `${PROJECT_NAME}/order`

export const ORDER_ACTIONS = {
  START: `${NAME}/START`,
  RETRY: `${NAME}/RETRY`,
  RESET: `${NAME}/RESET`,
  CANCEL: `${NAME}/CANCEL`,
  SUCCESS: `${NAME}/SUCCESS`,
  FINISH: `${NAME}/FINISH`,
  CLEAR_ORDER_GROUP: `${NAME}/CLEAR_ORDER_GROUP`,
  SET_CHECKOUT_ATTACHMENTS: `${NAME}/SET_CHECKOUT_ATTACHMENTS`,
  CANCEL_LAST_TRANSACTION: `${NAME}/CANCEL_LAST_TRANSACTION`,
  FINISHED_LAST_TRANSACTION: `${NAME}/FINISHED_LAST_TRANSACTION`,
  START_TRANSACTION: `${NAME}/START_TRANSACTION`,
  SET_GATEWAY_PAYMENTS: `${NAME}/SET_GATEWAY_PAYMENTS`,
  START_CHECKOUT_AUTHORIZE: `${NAME}/START_CHECKOUT_AUTHORIZE`,
  PROCESS_EXTERNAL_PAYMENTS: `${NAME}/PROCESS_EXTERNAL_PAYMENTS`,
  PROCESS_PAYMENT: `${NAME}/PROCESS_PAYMENT`,
  SEND_EXTERNAL_PAYMENT_STATUS_TO_GATEWAY: `${NAME}/SEND_EXTERNAL_PAYMENT_STATUS_TO_GATEWAY`,
  GET_ORDER_DETAIL: `${NAME}/GET_ORDER_DETAIL`,
  UPDATE_PAYMENTS_PAID: `${NAME}/UPDATE_PAYMENTS_PAID`,
  CLEAR_PAYMENTS_PAID: `${NAME}/CLEAR_PAYMENTS_PAID`,
  CANCEL_GIVEN_ORDER: `${NAME}/CANCEL_GIVEN_ORDER`,
  SAVE_CANCEL_GIVEN_ORDER: `${NAME}/SAVE_CANCEL_GIVEN_ORDER`,
  SUCCESS_CANCEL_GIVEN_ORDER: `${NAME}/SUCCESS_CANCEL_GIVEN_ORDER`,
  FINISH_CANCEL_GIVEN_ORDER: `${NAME}/FINISH_CANCEL_GIVEN_ORDER`,
  CLEAR_CANCEL_GIVEN_ORDER: `${NAME}/CLEAR_CANCEL_GIVEN_ORDER`,
  UPDATE_CANCEL_FISCAL_CODE: `${NAME}/UPDATE_CANCEL_FISCAL_CODE`,
  RESET_AUTOMATICALLY: `${NAME}/RESET_AUTOMATICALLY`,
  CLEAR: `${NAME}/CLEAR`,
  RELOAD_FORM: `${NAME}/RELOAD_FORM`,
  FORM_SUCCESS: `${NAME}/FORM_SUCCESS`,
  START_LOADING: `${NAME}/START_LOADING`,
  STOP_LOADING: `${NAME}/STOP_LOADING`,
  REQUEST_FAILED: `${NAME}/REQUEST_FAILED`,
  PRODUCT_ADDED: `${NAME}/PRODUCT_ADDED`,
  LOAD_INSTORE_ORDER_FORM: `${NAME}/LOAD_INSTORE_ORDER_FORM`,
  UPDATE_PAYMENTS: `${NAME}/UPDATE_PAYMENTS`,
  SEND_PAYMENTS: `${NAME}/SEND_PAYMENTS`,
  REMOVE_INSTALLMENTS_CC_PAYMENTS: `${NAME}/REMOVE_INSTALLMENTS_CC_PAYMENTS`,
  ADD_PAYMENT: `${NAME}/ADD_PAYMENT`,
  REMOVE_ALL_PAYMENTS: `${NAME}/REMOVE_ALL_PAYMENTS`,
  REMOVE_PAYMENT: `${NAME}/REMOVE_PAYMENT`,
  UPDATE_PAYMENT_FIXED: `${NAME}/UPDATE_PAYMENT_FIXED`,
  CHANGE_PAYMENT_SELECTED_INSTALLMENT: `${NAME}/CHANGE_PAYMENT_SELECTED_INSTALLMENT`,
  CHANGE_PAYMENT_VALUE: `${NAME}/CHANGE_PAYMENT_VALUE`,
  UPDATE_GIFTCARD: `${NAME}/UPDATE_GIFTCARD`,
  ADD_GIFTCARD: `${NAME}/ADD_GIFTCARD`,
  ADD_GITFCARD_WITH_REDEMPTION_CODE: `${NAME}/ADD_GITFCARD_WITH_REDEMPTION_CODE`,
  REMOVE_GIFTCARD: `${NAME}/REMOVE_GIFTCARD`,
  CHANGE_GIFTCARD_PROPERTY: `${NAME}/CHANGE_GIFTCARD_PROPERTY`,
  SET_CUSTOMER: `${NAME}/SET_CUSTOMER`,
  SET_CLIENT_PROFILE_DATA: `${NAME}/SET_CLIENT_PROFILE_DATA`,
  CHANGE_CLIENT_PROFILE_DATA: `${NAME}/CHANGE_CLIENT_PROFILE_DATA`,
  SET_DOCUMENT_FOR_RECEIPT: `${NAME}/SET_DOCUMENT_FOR_RECEIPT`,
  CHANGE_DOCUMENT_FOR_RECEIPT: `${NAME}/CHANGE_DOCUMENT_FOR_RECEIPT`,
  SET_LOCAL_MARKETING_DATA: `${NAME}/SET_LOCAL_MARKETING_DATA`,
  DISMISS_NOTIFICATIONS: `${NAME}/DISMISS_NOTIFICATIONS`,
  CLEAR_ORDER_FORM_MESSAGES: `${NAME}/CLEAR_ORDER_FORM_MESSAGES`,
  SET_USER_PICKED_GIFTS: `${NAME}/SET_USER_PICKED_GIFTS`,
  SAVE_NOTE: `${NAME}/SAVE_NOTE`,
  SAVE_VENDOR_CODE: `${NAME}/SAVE_VENDOR_CODE`,
  ADD_COUPON: `${NAME}/ADD_COUPON`,
  REMOVE_COUPON: `${NAME}/REMOVE_COUPON`,
  REMOVE_ORDER: `${NAME}/REMOVE_ORDER`,
  CHANGE_IDENTIFICATION_TYPE: `${NAME}/CHANGE_IDENTIFICATION_TYPE`,
  GET_GIFTCARD_PROVIDERS: `${NAME}/GET_GIFTCARD_PROVIDERS`,
  CHANGE_SELECTED_GIFTS: `${NAME}/CHANGE_SELECTED_GIFTS`,
  SET_CHECK_IN_VALUE: `${NAME}/SET_CHECK_IN_VALUE`,
  CHECK_IN: `${NAME}/CHECK_IN`,
  SALE_WITHOUT_STOCK_ALERT: `${NAME}/SALE_WITHOUT_STOCK_ALERT`,
  SET_STATE: `${NAME}/SET_STATE`,
  SET_CANCELLATION_STATUS: `${NAME}/SET_CANCELLATION_STATUS`,
  SET_ERROR: `${NAME}/SET_ERROR`,
  CLEAR_ERROR: `${NAME}/CLEAR_ERROR`,
}

type StepGroupType = keyof typeof ORDER_ACTIONS
type ActionStepType = {
  type: string
  payload: object
}

/** ACTION CREATORS **/

export function processOrderStep(stepGroup: StepGroupType): ActionStepType {
  return {
    type: ORDER_ACTIONS[stepGroup],
    payload: {
      stepGroup,
      step: getStepsByGroup(stepGroup)[0],
    },
  }
}

export function startOrder(transaction: object): ActionStepType {
  return {
    type: ORDER_ACTIONS.START,
    payload: {
      transaction,
    },
  }
}

export function setCheckoutAttachments(): ActionStepType {
  return {
    type: ORDER_ACTIONS.SET_CHECKOUT_ATTACHMENTS,
    payload: {
      step: getStepById('SET_CHECKOUT_ATTACHMENTS'),
      stepGroup: 'SET_CHECKOUT_ATTACHMENTS',
    },
  }
}

export function cancelLastTransaction(orderGroupId: object): ActionStepType {
  return {
    type: ORDER_ACTIONS.CANCEL_LAST_TRANSACTION,
    payload: {
      orderGroupId,
    },
  }
}

export function finishedLastTransaction(orderGroupId: object): ActionStepType {
  return {
    type: ORDER_ACTIONS.FINISHED_LAST_TRANSACTION,
    payload: {
      orderGroupId,
    },
  }
}

export function startTransaction(): ActionStepType {
  return {
    type: ORDER_ACTIONS.START_TRANSACTION,
    payload: {
      step: getStepById('START_TRANSACTION'),
      stepGroup: 'START_TRANSACTION',
    },
  }
}

export function setGatewayPayments(transaction: object): ActionStepType {
  return {
    type: ORDER_ACTIONS.SET_GATEWAY_PAYMENTS,
    payload: {
      transaction,
      step: getStepById('SET_GATEWAY_PAYMENTS'),
      stepGroup: 'START_TRANSACTION', // Gateway payments group is same as start transaction
    },
  }
}

export function startCheckoutAuthorize(): ActionStepType {
  return {
    type: ORDER_ACTIONS.START_CHECKOUT_AUTHORIZE,
    payload: {
      step: getStepById('START_CHECKOUT_AUTHORIZE'),
      stepGroup: 'START_CHECKOUT_AUTHORIZE',
    },
  }
}

export function processExternalPayments(paymentsData: object): ActionStepType {
  return {
    type: ORDER_ACTIONS.PROCESS_EXTERNAL_PAYMENTS,
    payload: {
      paymentsData,
      step: getStepById('PROCESS_EXTERNAL_PAYMENTS'),
      stepGroup: 'PROCESS_EXTERNAL_PAYMENTS',
    },
  }
}

export function processPayment(
  gatewayPaymentsInfo: object,
  gatewayPaymentsCache: object,
  externalPaymentInc: number
): ActionStepType {
  return {
    type: ORDER_ACTIONS.PROCESS_PAYMENT,
    payload: {
      gatewayPaymentsInfo,
      gatewayPaymentsCache,
      externalPaymentInc,
      step: getStepById('PROCESS_PAYMENT'),
      stepGroup: 'PROCESS_EXTERNAL_PAYMENTS',
    },
  }
}

export function sendPaymentStatusToGateway(
  paymentsPaid: [],
  gatewayPaymentsResponse: []
): ActionStepType {
  return {
    type: ORDER_ACTIONS.SEND_EXTERNAL_PAYMENT_STATUS_TO_GATEWAY,
    payload: {
      paymentsPaid,
      gatewayPaymentsResponse,
      step: getStepById('SEND_EXTERNAL_PAYMENT_STATUS_TO_GATEWAY'),
      stepGroup: 'PROCESS_EXTERNAL_PAYMENTS',
    },
  }
}

export function updatePaymentsPaid(paymentsPaid: object): ActionStepType {
  return {
    type: ORDER_ACTIONS.UPDATE_PAYMENTS_PAID,
    payload: {
      paymentsPaid,
    },
  }
}

export function clearPaymentsPaid(): ActionStepType {
  return {
    type: ORDER_ACTIONS.CLEAR_PAYMENTS_PAID,
    payload: {},
  }
}

export function cancelOrder(transaction: object): ActionStepType {
  return {
    type: ORDER_ACTIONS.CANCEL,
    payload: { transaction },
  }
}

export function orderRetry(): ActionStepType {
  return {
    type: ORDER_ACTIONS.RETRY,
    payload: {},
  }
}

export function orderReset(): ActionStepType {
  return {
    type: ORDER_ACTIONS.RESET,
    payload: {},
  }
}

export function automaticReset(): ActionStepType {
  return {
    type: ORDER_ACTIONS.RESET,
    payload: {
      resetAutomatically: true,
    },
  }
}

export function getOrderDetail(): ActionStepType {
  return {
    type: ORDER_ACTIONS.GET_ORDER_DETAIL,
    payload: {
      step: getStepById('GET_ORDER_DETAIL'),
      stepGroup: 'GET_ORDER_DETAIL',
    },
  }
}

export function orderSuccess(orderGroup: object): ActionStepType {
  return {
    type: ORDER_ACTIONS.SUCCESS,
    payload: {
      step: getStepById('FINISH_ORDER'),
      stepGroup: 'FINISH_ORDER',
      orderGroup,
    },
  }
}

export function finishOrder(): ActionStepType {
  return {
    type: ORDER_ACTIONS.FINISH,
    payload: {},
  }
}

export function clearOrderGroup(): ActionStepType {
  return {
    type: ORDER_ACTIONS.CLEAR_ORDER_GROUP,
    payload: {},
  }
}

export function cancelGivenOrder(orderId: object): ActionStepType {
  return {
    type: ORDER_ACTIONS.CANCEL_GIVEN_ORDER,
    payload: {
      orderId,
    },
  }
}

export function saveCancelGivenOrder(order: object): ActionStepType {
  return {
    type: ORDER_ACTIONS.SAVE_CANCEL_GIVEN_ORDER,
    payload: {
      order,
    },
  }
}

export function successCancelGivenOrder(): ActionStepType {
  return {
    type: ORDER_ACTIONS.SUCCESS_CANCEL_GIVEN_ORDER,
    payload: {},
  }
}

export function finishCancelGivenOrder(): ActionStepType {
  return {
    type: ORDER_ACTIONS.FINISH_CANCEL_GIVEN_ORDER,
    payload: {},
  }
}

export function clearCancelGivenOrder(): ActionStepType {
  return {
    type: ORDER_ACTIONS.CLEAR_CANCEL_GIVEN_ORDER,
    payload: {},
  }
}

export function updateCancelFiscalCode(
  orderId: object,
  printerResponse: any
): ActionStepType {
  const cfeXml = printerResponse?.xml
  return {
    type: ORDER_ACTIONS.UPDATE_CANCEL_FISCAL_CODE,
    payload: {
      orderId,
      cfeXml,
    },
  }
}

export function goToPlaceOrder() {
  return push('/placeorder')
}

export function goToOrderPlaced() {
  return push('/orderplaced')
}

export function clear(): ActionStepType {
  return {
    type: ORDER_ACTIONS.CLEAR,
    payload: {},
  }
}

export function reloadOrderForm(): ActionStepType {
  return { type: ORDER_ACTIONS.RELOAD_FORM, payload: {} }
}

export function orderFormSuccess(
  orderForm: object,
  requestPayload: object
): ActionStepType {
  return {
    type: ORDER_ACTIONS.FORM_SUCCESS,
    payload: { orderForm, requestPayload },
  }
}

export function startLoading(): ActionStepType {
  return { type: ORDER_ACTIONS.START_LOADING, payload: {} }
}

export function stopLoading(): ActionStepType {
  return { type: ORDER_ACTIONS.STOP_LOADING, payload: {} }
}

export function requestFailed(requestError: object): ActionStepType {
  return { type: ORDER_ACTIONS.REQUEST_FAILED, payload: { requestError } }
}

export function productAdded(id: string): ActionStepType {
  return { type: ORDER_ACTIONS.PRODUCT_ADDED, payload: { id } }
}

export function loadInStoreOrderForm(
  vendor: Vendor,
  identification: string | null = null,
  router: Router | null = null,
  route: string = '/cart'
): ActionStepType {
  return {
    type: ORDER_ACTIONS.LOAD_INSTORE_ORDER_FORM,
    payload: { vendor, identification, router, route },
  }
}

export function updatePayments(
  payments: [],
  focusedPayment = null,
  sendPaymentsAnyway = false
): ActionStepType {
  return {
    type: ORDER_ACTIONS.UPDATE_PAYMENTS,
    payload: { payments, focusedPayment, sendPaymentsAnyway },
  }
}

export function sendPayments(paymentsValue: object): ActionStepType {
  return { type: ORDER_ACTIONS.SEND_PAYMENTS, payload: { paymentsValue } }
}

export function removeInstallmentsFromCreditCardPayments(): ActionStepType {
  return { type: ORDER_ACTIONS.REMOVE_INSTALLMENTS_CC_PAYMENTS, payload: {} }
}

export function addPayment(payment: object): ActionStepType {
  return { type: ORDER_ACTIONS.ADD_PAYMENT, payload: { payment } }
}

export function removeAllPayments(): ActionStepType {
  return { type: ORDER_ACTIONS.REMOVE_ALL_PAYMENTS, payload: {} }
}

export function removePayment(index: number): ActionStepType {
  return { type: ORDER_ACTIONS.REMOVE_PAYMENT, payload: { index } }
}

export function updatePaymentsByFixed(
  payments: object,
  fixedPayments = []
): ActionStepType {
  return {
    type: ORDER_ACTIONS.UPDATE_PAYMENT_FIXED,
    payload: { payments, fixedPayments },
  }
}

export function changePaymentSelectedInstallment(
  index: number,
  installments: any
): ActionStepType {
  return {
    type: ORDER_ACTIONS.CHANGE_PAYMENT_SELECTED_INSTALLMENT,
    payload: { index, installments },
  }
}

export function changePaymentValue(index: number, value: any): ActionStepType {
  return { type: ORDER_ACTIONS.CHANGE_PAYMENT_VALUE, payload: { index, value } }
}

export function updateGiftCards(giftCards: object): ActionStepType {
  return {
    type: ORDER_ACTIONS.UPDATE_GIFTCARD,
    payload: { giftCards },
  }
}

export function addGiftCard(giftCard: object): ActionStepType {
  return { type: ORDER_ACTIONS.ADD_GIFTCARD, payload: { giftCard } }
}

export function addNewGiftCardWithRedemptionCode(
  redemptionCode: string,
  provider = DEFAULT_GIFT_CARD_PROVIDER
): ActionStepType {
  return {
    type: ORDER_ACTIONS.ADD_GITFCARD_WITH_REDEMPTION_CODE,
    payload: {
      newGiftCard: {
        id: uuid.v4(),
        redemptionCode,
        balance: null,
        inUse: true,
        isSpecialCard: false,
        provider,
        value: 0,
      },
    },
  }
}

export function removeGiftCard(giftCard: object): ActionStepType {
  return { type: ORDER_ACTIONS.REMOVE_GIFTCARD, payload: { giftCard } }
}

export function changeGiftCardProperty(
  giftCard: object,
  property: object,
  newValue: object
): ActionStepType {
  return {
    type: ORDER_ACTIONS.CHANGE_GIFTCARD_PROPERTY,
    payload: { giftCard, property, newValue },
  }
}

type CustomerDataType = {
  identification: string
  router: any // FIXME: can we be more specific?
  customerData: object
  fromRegisterForm: boolean
}

export function setCustomer({
  identification,
  router,
  customerData,
  fromRegisterForm = false,
}: CustomerDataType): ActionStepType {
  if (router) {
    router.push('/cart')
  }
  return {
    type: ORDER_ACTIONS.SET_CUSTOMER,
    payload: { identification, customerData, fromRegisterForm },
  }
}

export function setClientProfileData(data: object): ActionStepType {
  return { type: ORDER_ACTIONS.SET_CLIENT_PROFILE_DATA, payload: { data } }
}

export function setCheckInValue(isCheckedIn: boolean): ActionStepType {
  return { type: ORDER_ACTIONS.SET_CHECK_IN_VALUE, payload: { isCheckedIn } }
}

export function clearCheckInValue(): ActionStepType {
  return {
    type: ORDER_ACTIONS.SET_CHECK_IN_VALUE,
    payload: { isCheckedIn: undefined },
  }
}

export function changeClientProfileData(
  clientProfileData: string | object
): ActionStepType {
  if (typeof clientProfileData === 'string') {
    clientProfileData = EmailUtils.validateEmail(clientProfileData)
      ? { email: clientProfileData }
      : { document: clientProfileData }
  }

  CustomEvent.sendEvent('clientProfile.changed', {
    clientProfileData,
  })

  return { type: ORDER_ACTIONS.CHANGE_CLIENT_PROFILE_DATA, payload: {} }
}

export function setDocumentForReceipt(
  document: object,
  withLoading = false
): ActionStepType {
  return {
    type: ORDER_ACTIONS.SET_DOCUMENT_FOR_RECEIPT,
    payload: { document, withLoading },
  }
}

export function changeDocumentForReceipt(document: object): ActionStepType {
  return {
    type: ORDER_ACTIONS.CHANGE_DOCUMENT_FOR_RECEIPT,
    payload: { document },
  }
}

export function setLocalMarketingData(marketingData: object): ActionStepType {
  return {
    type: ORDER_ACTIONS.SET_LOCAL_MARKETING_DATA,
    payload: { marketingData },
  }
}

export function dismissNotifications(): ActionStepType {
  return { type: ORDER_ACTIONS.DISMISS_NOTIFICATIONS, payload: {} }
}

export function clearOrderFormMessages(orderForm: object): ActionStepType {
  return {
    type: ORDER_ACTIONS.CLEAR_ORDER_FORM_MESSAGES,
    payload: { orderForm },
  }
}

export function userPickedGifts(): ActionStepType {
  return { type: ORDER_ACTIONS.SET_USER_PICKED_GIFTS, payload: {} }
}

export function saveNote(text: string): ActionStepType {
  return { type: ORDER_ACTIONS.SAVE_NOTE, payload: { text } }
}

export function saveVendorCode(code: string): ActionStepType {
  return { type: ORDER_ACTIONS.SAVE_VENDOR_CODE, payload: { code } }
}

export function addCoupon(code: string): ActionStepType {
  return { type: ORDER_ACTIONS.ADD_COUPON, payload: { code } }
}

export function removeCoupon(): ActionStepType {
  return { type: ORDER_ACTIONS.REMOVE_COUPON, payload: {} }
}

export function removeOrder(): ActionStepType {
  return { type: ORDER_ACTIONS.REMOVE_ORDER, payload: {} }
}

export function changeIdentificationType(idType: string): ActionStepType {
  return { type: ORDER_ACTIONS.CHANGE_IDENTIFICATION_TYPE, payload: { idType } }
}

export function getGiftCardProviders(): ActionStepType {
  return { type: ORDER_ACTIONS.GET_GIFTCARD_PROVIDERS, payload: {} }
}

export function changeSelectedGifts(
  giftId: string,
  selectedGifts: any
): ActionStepType {
  return {
    type: ORDER_ACTIONS.CHANGE_SELECTED_GIFTS,
    payload: { giftId, selectedGifts },
  }
}

export function checkIn(isCheckedIn: boolean): ActionStepType {
  return { type: ORDER_ACTIONS.CHECK_IN, payload: { isCheckedIn } }
}

export function setOrderState(newState: any): ActionStepType {
  return { type: ORDER_ACTIONS.SET_STATE, payload: newState }
}

export function alertWithoutStockSale(orderGroup: string): ActionStepType {
  return {
    type: ORDER_ACTIONS.SALE_WITHOUT_STOCK_ALERT,
    payload: { orderGroup },
  }
}

export function setError(error: Error): ActionStepType {
  return {
    type: ORDER_ACTIONS.SET_ERROR,
    payload: { error },
  }
}

export function clearError(): ActionStepType {
  return {
    type: ORDER_ACTIONS.CLEAR_ERROR,
    payload: {},
  }
}

type CancelStatusType = {
  isCancelling: boolean
  messageId: string
}

export function setCancellationStatus({
  isCancelling,
  messageId,
}: CancelStatusType): ActionStepType {
  if (isCancelling && !messageId) {
    throw new Error("A 'messageId' must be provided if 'isCancelling' is true.")
  }

  return {
    type: ORDER_ACTIONS.SET_CANCELLATION_STATUS,
    payload: { isCancelling, messageId },
  }
}

export const actionCreators = {
  processOrderStep,
  startOrder,
  cancelLastTransaction,
  cancelOrder,
  clearOrderGroup,
  setCheckoutAttachments,
  startTransaction,
  setGatewayPayments,
  startCheckoutAuthorize,
  processExternalPayments,
  processPayment,
  sendPaymentStatusToGateway,
  getOrderDetail,
  updatePaymentsPaid,
  clearPaymentsPaid,
  orderRetry,
  orderReset,
  orderSuccess,
  cancelGivenOrder,
  saveCancelGivenOrder,
  clearCancelGivenOrder,
  updateCancelFiscalCode,
  goToPlaceOrder,
  goToOrderPlaced,
  automaticReset,
  reloadOrderForm,
  orderFormSuccess,
  startLoading,
  stopLoading,
  requestFailed,
  productAdded,
  loadInStoreOrderForm,
  updatePayments,
  sendPayments,
  removeInstallmentsFromCreditCardPayments,
  addPayment,
  removeAllPayments,
  removePayment,
  updatePaymentsByFixed,
  changePaymentSelectedInstallment,
  changePaymentValue,
  updateGiftCards,
  addGiftCard,
  addNewGiftCardWithRedemptionCode,
  removeGiftCard,
  changeGiftCardProperty,
  setCustomer,
  setClientProfileData,
  setCheckInValue,
  clearCheckInValue,
  changeClientProfileData,
  setDocumentForReceipt,
  changeDocumentForReceipt,
  setLocalMarketingData,
  dismissNotifications,
  clearOrderFormMessages,
  userPickedGifts,
  saveNote,
  addCoupon,
  removeCoupon,
  removeOrder,
  changeIdentificationType,
  getGiftCardProviders,
  changeSelectedGifts,
  checkIn,
  setCancellationStatus,
  setError,
  clearError,
}
