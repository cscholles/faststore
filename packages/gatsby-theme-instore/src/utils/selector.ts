import { createSelector, Selector } from 'reselect'

const defaultResultFunc: Selector<any, any> = (items: any) => items

export const createSelectorPathBuilder = <S, R, T>(
  selectors: Selector<S, R>[],
  resultFunc: (param: R) => T = defaultResultFunc
) => createSelector(selectors, resultFunc)
