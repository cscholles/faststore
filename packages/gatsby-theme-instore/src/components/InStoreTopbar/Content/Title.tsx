import React, { FC } from 'react'

interface TitleProps {
  title: string
}

type Props = TitleProps

const Title: FC<Props> = ({ title }: Props) => (
  <span>{ title }</span>
)

export default Title
