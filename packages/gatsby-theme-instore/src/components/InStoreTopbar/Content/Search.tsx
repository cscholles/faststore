import React, { FC } from 'react'

import IconSearch from './SearchIcon'

const InStoreTopbar: FC = () => (
  <form
    className="flex flex-auto items-center ba-l b--black-20 bg-base ph4-l"
    // onSubmit={this.handleFormSubmit}
  >
    <div className="flex-none pl4-ns dn db-l">
      <IconSearch
        width={22}
        height={22}
        color="#CCCCCC"
        animate={false}
      />
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
        placeholder="Buscar por código ou nome"
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

export default InStoreTopbar
