import { useOrderForm } from '../orderForm/useOrderForm'
import { useBestSeller } from '../product/useBestSeller'

interface Seller {
  sellerId: string
  commercialOffer: {
    availableQuantity: number
    price: number
  }
}

export interface SKU {
  itemId: string
  sellers: Seller[]
}

export const useBuyButton = (sku: Maybe<SKU>) => {
  const seller = useBestSeller(sku)
  const orderForm = useOrderForm()
  const disabled = !sku || !orderForm?.value

  // Optimist add item on click
  const onClick = async (e: any) => {
    e.preventDefault()

    if (!sku || !seller) {
      return
    }

    // Item to be updated into the orderForm
    const orderFormItem = {
      id: sku.itemId,
      quantity: 1,
      seller: seller.sellerId,
    }

    orderForm.addItems([orderFormItem]).catch(console.error)
  }

  return {
    disabled,
    onClick,
  }
}
