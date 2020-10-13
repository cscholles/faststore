import React, { FC } from 'react'

import IconSearch from './SearchIcon'

const InStoreTopbar: FC = () => (
  <div>
    <div className="bg-base b--black-20 flex flex-column bb">
      <div className="pv4">
        <div className="flex w-100 justify-between">
          <div className="flex flex-auto items-center">
            <div className="relative flex flex-auto items-center h-100 w-100">
              <div className="f4 flex flex-grow-1 flex-shrink-1 noselect title-logo pl5">
                inStore
              </div>
              <div className="w-40-l flex flex-auto flex-none-l mr5">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default InStoreTopbar
