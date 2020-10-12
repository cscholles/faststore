import { Box, Center, Flex, Spinner } from '@vtex/store-ui'
import { PageProps } from 'gatsby'
import React, { FC, Suspense, useEffect, useState } from 'react'
import { hydrate } from 'react-dom'

import { AUTH_PROVIDERS } from '../components/Auth'
import Layout from '../components/Layout'
import SuspenseSSR from '../components/Suspense/SSR'
import { isServer } from '../utils/env'

type Props = PageProps<unknown>

const Page: FC = () => {
  const [index, setIndex] = useState(0)
  const { Component } = AUTH_PROVIDERS[index]

  return (
    <Flex variant="login.page.container">
      <Box variant="login.page.group">
        <Box variant="login.page.group.title">Choose a sign in option</Box>

        {AUTH_PROVIDERS.map(({ Button }, i) =>
          i !== index ? (
            <Button key={i} variant="login.page" onClick={() => setIndex(i)} />
          ) : null
        )}
      </Box>

      <Box variant="login.page.group">
        <Component variant="page" />
      </Box>
    </Flex>
  )
}

// We split into two components to avoid re-rendering the <Layout/> when
// selecting Auth method
const PageWithLayout: FC<Props> = () => {
  return (
    <Layout>
      <SuspenseSSR
        fallback={
          <Center>
            <Spinner />
          </Center>
        }
      >
        <Page />
      </SuspenseSSR>
    </Layout>
  )
}

export default PageWithLayout