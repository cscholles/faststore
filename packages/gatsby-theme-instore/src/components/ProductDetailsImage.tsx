import { Image } from '@vtex/gatsby-source-vtex'
import { useLocation } from '@reach/router'
import { ProgressiveImage, AspectImage } from '@vtex/store-ui'
import React, { FC } from 'react'

import { IMAGE_DEFAULT } from '../sdk/img/constants'
import { useScaledImage } from '../sdk/img/useScaledImage'
import { SIZE as PRODUCT_SUMMARY_SIZE } from './ProductSummaryImage'

interface Props {
  width?: number
  height?: number
  src: Image['imageUrl']
  alt: Image['imageText']
  loading?: 'lazy' | 'eager'
}

export const SIZE = 500

const ProductDetailsImage: FC<Props> = ({
  width = SIZE,
  height = SIZE,
  src: rawSrc = IMAGE_DEFAULT,
  alt = 'Product Image',
  loading = 'lazy',
}) => {
  const { state } = useLocation()
  const src = useScaledImage(rawSrc, width, height)
  const tinySrc = useScaledImage(
    rawSrc,
    PRODUCT_SUMMARY_SIZE,
    PRODUCT_SUMMARY_SIZE
  )

  const progressive = (state as any)?.fromSummary
  const placeholder = progressive ? tinySrc : src

  return (
    <ProgressiveImage
      as={AspectImage}
      placeholder={placeholder}
      src={src}
      ratio={1}
      loading={loading}
      alt={alt}
      width={`${width}px`}
      height={`${height}px`}
    />
  )
}

export default ProductDetailsImage
