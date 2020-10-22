import React, { FC, lazy, useEffect } from 'react'
import { PageProps } from 'gatsby'

import AboveTheFold from '../components/HomePage/AboveTheFold'
import BelowTheFoldPreview from '../components/HomePage/BelowTheFoldPreview'
import Layout from '../components/Layout'
import SuspenseViewport from '../components/Suspense/Viewport'
import SuspenseSSR from '../components/Suspense/SSR'
import InStoreTopbar from '../components/InStoreTopbar'
import { Identification } from '../components/Identification'
import App from '../components/App'

const belowTheFoldPreloader = () =>
  import('../components/HomePage/BelowTheFold')

const BelowTheFold = lazy(belowTheFoldPreloader)
const SEO = lazy(() => import('../components/HomePage/SEO'))

type Props = PageProps<unknown>

const initialState = {
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
}

const Home: FC<Props> = (props) => {
  useEffect(() => {
    ;(window as any).vtexrca('sendevent', 'homeView', {})
  }, [])

  return (
    <Layout>
      <App>
        <InStoreTopbar />
        <Identification
          order={initialState.order}
          clearCustomer={() => {}}
          clearSearch={() => {}}
          onChangeIdentificationType={() => {}}
        />
      </App>
    </Layout>
  )
}

export default Home
