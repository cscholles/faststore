import React, { FC, Fragment } from 'react'

interface AppProps {
  components: Record<string, any>
  rules: string[]
}

export const App: FC<AppProps> = ({ children, rules, components }) => {
  return <Fragment>{rules.map((rule) => components[rule])}</Fragment>
}
