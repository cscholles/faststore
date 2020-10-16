import { createSelectorPathBuilder } from './selector'

export const orderSelector = createSelectorPathBuilder([
  (state: any) => state && state.order,
])
