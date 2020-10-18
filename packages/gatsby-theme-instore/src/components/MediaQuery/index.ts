import React, { ComponentType, createRef, RefObject } from 'react'
import debounce from 'lodash/debounce'

import { getCurrentBreakpoint, mediaQuery } from '../../utils/mediaQuery'

interface WithMediaQueryState {
  breakpoint: string
}

export const withMediaQuery = <P extends object>(
  Component: ComponentType<P>,
  { withRef = false } = {}
): any => {
  class WithMediaQuery extends React.Component<P, WithMediaQueryState> {
    wrappedInstance: RefObject<HTMLElement>
    constructor(props: P) {
      super(props)
      this.state = {
        breakpoint: getCurrentBreakpoint(),
      }
      this.wrappedInstance = createRef()
    }

    handleWindowResize = debounce(() => {
      const lastBreakpoint = this.state.breakpoint
      const currentBreakpoint = getCurrentBreakpoint()
      if (lastBreakpoint !== currentBreakpoint) {
        this.setState({
          breakpoint: currentBreakpoint,
        })
      }
    }, 100)

    componentDidMount() {
      window.addEventListener('resize', this.handleWindowResize)
    }

    componentWillUnmount() {
      this.handleWindowResize.cancel()
      window.removeEventListener('resize', this.handleWindowResize)
    }

    getWrappedInstance() {
      if (withRef) {
        return this.wrappedInstance
      }
      console.warn(
        'mediaQuery: Unable to get instance of component. To get the component instance, use withMediaQuery with the option withRef set to true. Example: withMediaQuery( <Component>, {withRef:true} )'
      )
      return null
    }

    render() {
      return null
    }
  }

  return WithMediaQuery
}
