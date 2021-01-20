import { useLocation } from '@reach/router'
import type { PopoverInitialState } from '@vtex/store-ui'
import { usePopoverState } from '@vtex/store-ui'
import { useCallback, useEffect } from 'react'

type Props = {
  popoverState?: PopoverInitialState
  ref: any
}

const useSearchBarInput = (props: Props) => {
  const location = useLocation()
  const { toggle: t, ...popover } = usePopoverState(props.popoverState)
  const { show, visible, hide } = popover

  // Close it whenever the page changes
  useEffect(() => {
    hide()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  // When clicking in the input, always open but never close
  // search autocomplete
  const toggle = useCallback(() => {
    if (!visible) {
      show()
    }
  }, [show, visible])

  useEffect(() => {
    // Focus input when input is clicked
    if (popover.visible) {
      props.ref.current?.focus()
    }
    // Blurs input when user clicks away
    else {
      props.ref.current?.blur()
    }
  }, [popover.visible, props.ref])

  return { popover, toggle }
}

export default useSearchBarInput
