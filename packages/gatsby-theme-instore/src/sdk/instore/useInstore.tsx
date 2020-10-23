import { useContext } from 'react'

import { InstoreContext, InstoreDispatcher } from './Provider'

export const useInstore = () => useContext<InstoreState>(InstoreContext)
export const useDispatcher = () => useContext(InstoreDispatcher)
