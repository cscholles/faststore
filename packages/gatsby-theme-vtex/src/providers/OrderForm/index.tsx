/**
 * This provider starts fetching early and adds a suspendable reader to
 * the context. Use the hooks to interact with the context
 */
import { OrderForm as OrderFormType } from '@vtex/gatsby-source-vtex'
import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { storage } from './storage'
import { OrderFormItem } from './types'

const controler = () => import('./controler')

type OrderFormContext = {
  value: OrderFormType | null
  addItems: (items: OrderFormItem[]) => Promise<void>
}

const OrderForm = createContext<OrderFormContext | null>(null)

const OrderFormProvider: FC = ({ children }) => {
  const [orderForm, setOrderForm] = useState<OrderFormType | null>(() =>
    storage.get()
  )

  const id = orderForm?.orderFormId

  // Fetch orderForm on first render
  useEffect(() => {
    let cancel = false

    const fetchAndDispatch = async () => {
      const { fetchOrderForm, startOrderForm } = await controler()

      const data = await fetchOrderForm(orderForm)

      if (!cancel) {
        startOrderForm(data, setOrderForm)
      }
    }

    fetchAndDispatch()

    return () => {
      cancel = true
    }
  }, [orderForm])

  // Add item to cart using the queue
  const addItems = useCallback(
    async (items) => {
      const ctl = await controler()

      ctl.addItems(id, setOrderForm, items)
    },
    [id]
  )

  return (
    <OrderForm.Provider
      value={{
        value: orderForm,
        addItems,
      }}
    >
      {children}
    </OrderForm.Provider>
  )
}

export const useOrderForm = (): OrderFormContext => {
  const ctx = useContext(OrderForm)

  if (!ctx) {
    throw new Error(
      'useOrderForm needs to have an OrderFormProvider previously in the React tree'
    )
  }

  return ctx
}

export default OrderFormProvider