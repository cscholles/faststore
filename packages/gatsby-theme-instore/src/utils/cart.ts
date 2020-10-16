import isEmpty from 'lodash/isEmpty'

import { CatalogLogisticsInfoType } from './catalog'

interface CartInfoType {
  [key: string]: CatalogLogisticsInfoType
}

export const createLogisticsInfoCacheKey = (skuId: string, quantity: number) =>
  `${skuId}-${quantity}`

export const getSimulationLogisticsInfo = (
  logisticsInfoCache: CartInfoType,
  skuId: string,
  quantity: number
) => {
  const key = createLogisticsInfoCacheKey(skuId, quantity)
  const logisticsInfo = logisticsInfoCache && logisticsInfoCache[key]

  if (isEmpty(logisticsInfo)) {
    return []
  }

  return logisticsInfo
}
