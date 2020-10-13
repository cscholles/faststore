import get from 'lodash/get'
import { getReduxStore } from '../redux/reduxStore'

import { createSelectorPathBuilder } from './selector'

export const vendorSelector = createSelectorPathBuilder((state) =>
  get(state, ['vendor', 'vendor'], null)
)

export function getVendor(): any {
  const store = getReduxStore()

  return store && vendorSelector(store.getState())
}
