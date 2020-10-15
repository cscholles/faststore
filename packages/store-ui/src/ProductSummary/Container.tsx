/** @jsx jsx */
import { FC } from 'react'
import { jsx } from 'theme-ui'

import LocalizedLink from '../LocalizedLink/index'

interface Props {
  to: string
  variant: string
}

const ProductSummaryContainer: FC<Props> = ({ children, to, variant }) => (
  <LocalizedLink
    state={{ fromSummary: true }}
    to={to}
    sx={{
      variant: `productSummary.${variant}.container`,
      textDecoration: 'none',
      color: 'text',
      flexGrow: 1,
    }}
  >
    {children}
  </LocalizedLink>
)

export default ProductSummaryContainer
