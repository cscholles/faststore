import isEmpty from 'lodash/isEmpty'
import isNumber from 'lodash/isNumber'
import isArray from 'lodash/isArray'
import every from 'lodash/every'
import get from 'lodash/get'

import { getDefaultSeller, SellerType } from './seller'

export type CatalogLogisticsInfoType = {
  slas: []
}

type CatalogSkuType = {
  sellers: SellerType[]
}

export function isSkuAvailable(
  sku: CatalogSkuType,
  logisticsInfo: CatalogLogisticsInfoType[]
): boolean {
  if (isEmpty(sku)) {
    console.error('Invalid SKU: ', sku)
    return false
  }

  if (!isArray(logisticsInfo)) {
    console.error('Invalid logisticsInfo : ', logisticsInfo)
    return false
  }

  const hasPrice = isNumber(getSkuPrice(sku))
  if (!hasPrice) {
    return false
  }

  if (isEmpty(logisticsInfo)) {
    return false
  }
  const slasList = logisticsInfo.map(
    (logisticsInfoItem) => logisticsInfoItem.slas || []
  )
  if (isEmpty(slasList)) {
    return false
  }
  const hasAvailability = every(slasList, (sla) => !isEmpty(sla))
  return hasAvailability
}

export function getSkuPrice(sku: CatalogSkuType, seller?: SellerType) {
  const newSeller = seller || getDefaultSeller(get(sku, 'sellers'))
  return get(newSeller, ['commertialOffer', 'price'])
}
