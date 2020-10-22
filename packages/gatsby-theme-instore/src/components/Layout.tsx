/** @jsx jsx */
import { jsx } from '@vtex/store-ui'
import { FC, Fragment, lazy } from 'react'

import Header from './Header'
import SuspenseViewport from './Suspense/Viewport'
import Tachyons from '../layout/tachyons'

const loader = () => import('./Footer')

const Footer = lazy(loader)

const Layout: FC = ({ children }) => (
  <Fragment>
    <style>{Tachyons}</style>
    {children}
  </Fragment>
)

export default Layout
