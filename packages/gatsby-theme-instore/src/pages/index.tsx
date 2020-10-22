import React, { FC, lazy, useEffect } from 'react'
import { PageProps } from 'gatsby'

import AboveTheFold from '../components/HomePage/AboveTheFold'
import BelowTheFoldPreview from '../components/HomePage/BelowTheFoldPreview'
import Layout from '../components/Layout'
import SuspenseViewport from '../components/Suspense/Viewport'
import SuspenseSSR from '../components/Suspense/SSR'
import InStoreTopbar from '../components/InStoreTopbar'
import { useOrderForm } from '../sdk/orderForm/useOrderForm'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

const belowTheFoldPreloader = () =>
  import('../components/HomePage/BelowTheFold')

const BelowTheFold = lazy(belowTheFoldPreloader)
const SEO = lazy(() => import('../components/HomePage/SEO'))

type Props = PageProps<unknown>

const Home: FC<Props> = (props) => {
  useEffect(() => {
    ;(window as any).vtexrca('sendevent', 'homeView', {})
  }, [])

  const { value } = useOrderForm()
  const { formatMessage } = useIntl()

  console.log(`--- `, { value })
  console.log(`--- `, {
    message: formatMessage({ id: 'minicart.drawer.close' }),
  })

  return (
    <Layout>
      <InStoreTopbar />
    </Layout>
  )
}

export default Home
