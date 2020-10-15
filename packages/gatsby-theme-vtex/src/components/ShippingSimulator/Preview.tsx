import React, { FC } from 'react'
import Skeleton from 'react-loading-skeleton'
import { Box } from '@vtex/store-ui'

interface Props {
  variant: string
}

const ShippingSimulatorPreview: FC<Props> = ({ variant }) => (
  <Box variant={variant} sx={{ marginX: 10 }}>
    <Skeleton height={20} />
  </Box>
)

export default ShippingSimulatorPreview
