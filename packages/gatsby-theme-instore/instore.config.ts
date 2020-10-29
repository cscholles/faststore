import { createElement } from 'react'

const ExampleComponent = createElement('h1', {}, ['Example 1'])

const config = {
  pages: [
    {
      title: 'Vincent',
      route: '/vincent',
      components: [
        {
          id: 'has48',
          component: ExampleComponent,
          props: {},
          children: [],
        },
      ],
    },
  ],
}

export default config

// {
//   title: 'Página',
//   components: [{
//       id: 'has48',
//       component: Greeting,
//       props: {
//           name: 'João',
//       }
//   }, {
//       id: 'has48',
//       component: Bye,
//       props: {
//           surname: 'Silva',
//       }
//   }]
// }
