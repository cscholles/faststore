import React from 'react'

import DynamicPage from './DynamicPage.component'

const Greeting = ({ name }: { name: string }) => <p>Hello, { name }!</p>

const Bye = ({ surname }: { surname: string }) => <p>Bye, { surname }!</p>

const config = {
    title: 'Página',
    components: [{
        id: 'has48',
        component: Greeting,
        props: {
            name: 'João',
        }
    }, {
        id: 'has48',
        component: Bye,
        props: {
            surname: 'Silva',
        }
    }]
}

const DynamicPageContainer = () => (
    <DynamicPage config={config} />
)

export default DynamicPageContainer
