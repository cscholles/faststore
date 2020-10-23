import React from 'react'

import IconSearch from './SearchIcon'
import { useSearch } from '../../../sdk/search/useSearch'

interface SearchInputProps {
  placeholder?: string
}

type Props = SearchInputProps

const SearchInput: React.FC<Props> = ({
  placeholder = 'Buscar por código ou nome',
}: Props) => {
  const { onSearch } = useSearch()

  return (
    <form
      className="flex flex-auto items-center ba-l b--black-20 bg-base ph4-l"
      onSubmit={onSearch}
    >
      <div className="flex-none pl4-ns dn db-l">
        <IconSearch width={22} height={22} color="#CCCCCC" animate={false} />
      </div>
      <div className="flex-auto mh5-l pv2-ns">
        <input
          id="search-input"
          data-cy="search-input"
          // autoFocus={pathname === '/search'}
          // ref={(input) => {
          //   this.searchInput = input
          // }}
          type="search"
          className="bn bg-transparent w-100 pv3 pv2-l f4 f5-l fw3 lh-copy-ns"
          placeholder={placeholder}
          // value={term || ''}
          // disabled={isNextLoading}
          // onChange={this.handleChange}
          // onFocus={this.handleFocus}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>
    </form>
  )
}

export default SearchInput
