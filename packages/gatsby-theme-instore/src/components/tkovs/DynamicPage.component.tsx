import React from 'react'

import DynamicComponent from './DynamicComponent.component'

interface DynamicPageProps {
  pageContext: { config: any }
}

type Props = DynamicPageProps

const DynamicPage: React.FC<Props> = ({ pageContext }) => {
  const { config } = pageContext
  return (
    <div>
      <h1>{config.title}</h1>

      {config.components.map((component: any) => (
        <DynamicComponent key={component.id} component={component} />
      ))}
    </div>
  )
}

export default DynamicPage
