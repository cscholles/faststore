import React from 'react'

export const DynamicComponent = ({ component }: any) => (
    React.createElement(
        component.component,
        component.props
    )
)

export default DynamicComponent
