import React from 'react'

import DynamicComponent from './DynamicComponent.component'

interface DynamicPageProps {
    config: any,
}

type Props = DynamicPageProps

const DynamicPage: React.FC<Props> = ({ config }) => (
    <div>
        <h1>{config.title}</h1>

        {config.components.map((component: any) => 
            <DynamicComponent key={component.id} component={component} />
        )}
    </div>
)

export default DynamicPage
