import { StepOrderType, StepOrderObjType, getStepIndex } from '../utils/step'

interface ObjectOrderStepArrayType {
  [key: string]: StepOrderType[]
}

export const ORDER_STEPS: ObjectOrderStepArrayType = {
  SET_CHECKOUT_ATTACHMENTS: [
    {
      id: 'SET_CHECKOUT_ATTACHMENTS',
      estimatedDuration: 3000,
      message: 'sendingRequest',
    },
  ],
  START_TRANSACTION: [
    {
      id: 'START_TRANSACTION',
      estimatedDuration: 9000,
      message: 'startingTransaction',
    },
    {
      id: 'SET_GATEWAY_PAYMENTS',
      estimatedDuration: 6000,
      message: 'startingPayment',
    },
  ],
  PROCESS_EXTERNAL_PAYMENTS: [
    {
      id: 'PROCESS_EXTERNAL_PAYMENTS',
      estimatedDuration: 3000,
      totalEstimatedDuration: function (
        numberOfExternalPayments: number
      ): number {
        return this.estimatedDuration * numberOfExternalPayments
      },
      message: 'receivingInfo',
    },
    {
      id: 'PROCESS_PAYMENT',
      estimatedDuration: 1000,
      totalEstimatedDuration: function (
        numberOfExternalPayments: number
      ): number {
        return this.estimatedDuration * numberOfExternalPayments
      },
      message: 'openingPayment',
    },
    {
      id: 'SEND_EXTERNAL_PAYMENT_STATUS_TO_GATEWAY',
      estimatedDuration: 3000,
      totalEstimatedDuration: function (
        numberOfExternalPayments: number
      ): number {
        return this.estimatedDuration * numberOfExternalPayments
      },
      message: 'sendingPayment',
    },
  ],
  START_CHECKOUT_AUTHORIZE: [
    {
      id: 'START_CHECKOUT_AUTHORIZE',
      estimatedDuration: 3000,
      message: 'verifyingAuth',
    },
  ],
  GET_ORDER_DETAIL: [
    {
      id: 'GET_ORDER_DETAIL',
      estimatedDuration: 3000,
      message: 'completingOrder',
    },
  ],
  FINISH_ORDER: [
    {
      id: 'FINISH_ORDER',
      estimatedDuration: 100,
      message: 'completingOrder',
    },
  ],
}

type OrderStepGroupType = keyof typeof ORDER_STEPS

export const ORDER_STEPS_LIST: StepOrderType[] = []
const ORDER_STEPS_BY_ID: StepOrderObjType = {}

Object.keys(ORDER_STEPS).forEach((stepGroup: string) => {
  const sGroup = <OrderStepGroupType>stepGroup
  const stepsByGroup = ORDER_STEPS[sGroup]
  stepsByGroup.forEach((step: StepOrderType) => {
    step.stepGroup = stepGroup
    ORDER_STEPS_BY_ID[step.id] = step
    ORDER_STEPS_LIST.push(step)
  })
})

export function getStepById(id: string): StepOrderType {
  return ORDER_STEPS_BY_ID[id]
}

export function getStepIndexById(id: string): number {
  const step = getStepById(id)
  return getStepIndex(step, ORDER_STEPS_LIST)
}

export function getStepsByGroup(stepGroup: OrderStepGroupType) {
  return ORDER_STEPS[stepGroup]
}
