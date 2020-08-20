import { useContext } from 'react'

import { SearchContext } from './Provider'

export const useSearchFilters = () => useContext(SearchContext).filters
