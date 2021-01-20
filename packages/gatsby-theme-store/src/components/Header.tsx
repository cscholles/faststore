import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { LocalizedLink } from '@vtex/store-ui'
import type { FC } from 'react'
import React, { Fragment } from 'react'

import Login from './Login'
import Logo from './Logo'
import Minicart from './Minicart'
import SearchBar from './SearchBar'

const StoreHeader: FC = () => {
  const { formatMessage } = useIntl()

  return (
    <Fragment>
      <div className="bg-green-100 text-center hidden py-3 font-medium text-xs sm:block">
        {formatMessage({ id: 'notification-bar.sale' })}
      </div>
      <div className="hidden sm:flex justify-between bg-blue-900 px-6 py-3 text-white">
        <div>
          <LocalizedLink className="mr-8 hover:opacity-60" to="/">
            Shop
          </LocalizedLink>
          <LocalizedLink className="hover:opacity-60" to="/about">
            About us
          </LocalizedLink>
        </div>
        <a className="hover:opacity-60" target="blank" href="https://vtex.com">
          visit vtex.com
        </a>
      </div>
      <header className="bg-gray-100 flex flex-col py-6 sm:flex-row sm:justify-between sm:items-center sm:px-6 sm:h-20">
        <div className="flex flex-col items-center sm:flex-row">
          <LocalizedLink to="/">
            <Logo />
          </LocalizedLink>
          <nav className="my-6 sm:ml-8">
            <LocalizedLink
              to="/apparel---accessories"
              activeClassName="text-blue-900"
              className="mr-8 hover:opacity-60"
            >
              Apparel
            </LocalizedLink>
            <LocalizedLink
              to="/electronics"
              activeClassName="text-blue-900"
              className="mr-8 hover:opacity-60"
            >
              Electronics
            </LocalizedLink>
            <LocalizedLink
              className="hover:opacity-60"
              to="/about"
              activeClassName="text-blue-900"
            >
              About
            </LocalizedLink>
          </nav>
        </div>
        <div className="flex flex-col items-center sm:flex-row">
          <SearchBar placeholder="Search" aria-label="Search" />
          <div className="flex items-center">
            <Login />
            <Minicart />
          </div>
        </div>
      </header>
    </Fragment>
  )
}

export default StoreHeader
