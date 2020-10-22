import React, { FC, Fragment } from 'react'
import { PageProps } from 'gatsby'
import { Center, Text } from '@vtex/store-ui'

type Props = PageProps<unknown>

const Fold: FC<Props> = () => (
  <Fragment>
    <Center height="800px">
      <Text sx={{ width: '50%' }}>
        This is the Above the fold part of your home page. All sync items should
        be rendered in here. Thus, make sure all data rendered in this part is
        fetched during Server Side Rendering and revalidated on the client if
        necessary
      </Text>
    </Center>
  </Fragment>
)

export default Fold
