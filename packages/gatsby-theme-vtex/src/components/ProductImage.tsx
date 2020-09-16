import { Image } from '@vtex/gatsby-source-vtex'
import React, { FC } from 'react'
import { AspectImage } from 'theme-ui'

import { IMAGE_DEFAULT, scaleImage } from '../utils/img'

interface Props {
  width: number
  height: number
  src: Image['imageUrl']
  alt: Image['imageText']
  loading?: 'lazy' | 'eager'
}

const ProductImage: FC<Props> = ({
  width = 300,
  height = 300,
  src = IMAGE_DEFAULT,
  alt = 'Product Image',
  loading = 'lazy',
}) => (
  <AspectImage
    ratio={1}
    loading={loading}
    src={scaleImage(src, width, height)}
    alt={alt}
    width={`${width}px`}
    height={`${height}px`}
  />
)

export default ProductImage