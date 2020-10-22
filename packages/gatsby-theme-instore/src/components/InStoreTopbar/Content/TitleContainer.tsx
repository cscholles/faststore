import React from 'react'

import Title from './Title'

const TitleContainer: React.FC<{ value: number }> = ({ value }) => {
  const newValue = value + 1
  return <Title title={`inStore ${newValue}`} />
}

export default TitleContainer
