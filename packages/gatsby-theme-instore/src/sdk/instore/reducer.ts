import { initialState } from './Provider'

export type ACTIONTYPE = { type: string; payload: Record<string, unknown> }
export const ACTION_CHANGE_ORDER = 'instore/order/CHANGE'
export const ACTION_CHANGE_PROFILE = 'instore/profile/CHANGE'
// export const ACTION_CHANGE_ID_TYPE =
//   'instore/profile/CHANGE_IDENTIFICATION_TYPE'

// return { type: ORDER_ACTIONS.CHANGE_IDENTIFICATION_TYPE, payload: { idType } }

export function reducer(state: typeof initialState, action: ACTIONTYPE) {
  switch (action.type) {
    case ACTION_CHANGE_ORDER: {
      return { ...state, order: { ...state.order, ...action.payload } }
    }
    case ACTION_CHANGE_PROFILE: {
      return { ...state, profile: { ...state.profile, ...action.payload } }
    }

    default:
      throw new Error()
  }
}
