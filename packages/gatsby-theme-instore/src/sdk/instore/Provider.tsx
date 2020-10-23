/**
 * This provider starts fetching early and adds a suspendable reader to
 * the context. Use the hooks to interact with the context
 */
import React, { FC, useReducer } from 'react'

import { reducer } from './reducer'

export const initialState: InstoreState = {
  order: {
    identificationType: 'Email',
    orderForm: {
      orderFormId: '',
      clientProfileData: {
        email: '',
        document: '',
      },
    },
  },
  profile: {},
}

export const InstoreContext = React.createContext<InstoreState>(initialState)
export const InstoreDispatcher = React.createContext(undefined as any)

export const InstoreProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <InstoreContext.Provider value={state}>
      <InstoreDispatcher.Provider value={dispatch}>
        {children}
      </InstoreDispatcher.Provider>
    </InstoreContext.Provider>
  )
}
