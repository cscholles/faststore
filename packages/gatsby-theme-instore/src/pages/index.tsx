import React, { FC, lazy, useEffect } from 'react'
import { PageProps } from 'gatsby'

type Props = PageProps<unknown>

const Home: FC<Props> = (props) => {
  useEffect(() => {
    ;(window as any).vtexrca('sendevent', 'homeView', {})
  }, [])

  return <p>Teste</p>
}

export default Home
