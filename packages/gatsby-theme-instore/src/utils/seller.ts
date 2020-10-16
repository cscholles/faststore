import get from 'lodash/get'
import { getInstoreConfig } from './config'

export type SellerCommertialOfferType = {
  price: number
}

export type SellerType = {
  id: string
  commertialOffer: SellerCommertialOfferType
}

export function getDefaultSellerId(): string {
  const { defaultSellerId } = getInstoreConfig()
  return defaultSellerId || '1'
}

export function getDefaultSeller(sellers: SellerType[]) {
  const defaultSellerId = getDefaultSellerId()
  return (
    sellers && sellers.find((seller) => get(seller, 'id') === defaultSellerId)
  )
}
