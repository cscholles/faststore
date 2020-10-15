import React, { FC } from 'react'
import { Box } from '@vtex/store-ui'

import { useNumberFormat } from '../../sdk/localization/useNumberFormat'
import { ShippingQueryQuery } from './__generated__/ShippingQuery.graphql'
import { TranslateEstimate } from './TranslateEstimate'

type Props = {
  shipping: ShippingQueryQuery | null
  variant: string
}

const ShippingTable: FC<Props> = ({ shipping, variant }) => {
  const tableVariant = `${variant}.table`

  return (
    <Box as="table" variant={tableVariant}>
      <Box as="thead" variant={`${tableVariant}.thead`}>
        <Box as="tr" variant={`${tableVariant}.thead.row`}>
          <Box as="th" variant={`${tableVariant}.thead.id`}>
            Nome
          </Box>
          <Box as="th" variant={`${tableVariant}.thead.estimate`}>
            Prazo
          </Box>
          <Box as="th" variant={`${tableVariant}.thead.price`}>
            Preço
          </Box>
        </Box>
      </Box>
      <Box as="tbody" variant={`${tableVariant}.tbody`}>
        {shipping?.vtex.shippingSLA?.deliveryOptions?.map((option) => {
          if (!option?.estimate || !option.id) return null

          const shippingOptionProps = {
            id: option.id,
            price: option.price ?? 0,
            estimate: option.estimate,
          }

          return (
            <ShippingOption
              variant={variant}
              key={shippingOptionProps.id}
              {...shippingOptionProps}
            />
          )
        })}
      </Box>
    </Box>
  )
}

type ShippingOptionProps = {
  id: string
  estimate: string
  price: number
  variant: string
}

const ShippingOption: FC<ShippingOptionProps> = ({
  id,
  price,
  estimate,
  variant,
}) => {
  const format = useNumberFormat()

  const freighPrice = price ? format.format(price) : 'Grátis'

  return (
    <Box as="tr" variant={`${variant}.optionRow`}>
      <Box as="td" variant={`${variant}.idCell`}>
        <Box as="label" variant={`${variant}.idLabel`}>
          <input type="radio" name="shipping-option" />
          {id}
        </Box>
      </Box>
      <Box as="td" variant={`${variant}.estimateCell`}>
        <TranslateEstimate shippingEstimate={estimate} />
      </Box>
      <Box as="td" variant={`${variant}.priceCell`}>
        {freighPrice}
      </Box>
    </Box>
  )
}

export default ShippingTable
