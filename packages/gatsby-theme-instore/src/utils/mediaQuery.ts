import isNil from 'lodash/isNil'
import toPairs from 'lodash/toPairs'

const breakpoints = {
  desktop: 1024,
  tablet: 600,
  phone: 0,
  s: 320,
  ns: 640,
  m: 640,
  l: 1024,
  xl: 1280,
}

export function getWindowWidth(): number {
  return window.innerWidth
}

export type MediaQueryGetter = (
  values: Record<string, number>,
  windowWidth?: Optional<number>
) => number

const sortPairsAscending = ([, a]: any, [, b]: any) => a - b
const breakpointsPairs = toPairs(breakpoints).sort(sortPairsAscending)

const getCurrentBreakpoint = (windowWidth: number | null = null) => {
  if (windowWidth == null) windowWidth = getWindowWidth()
  const [result] = breakpointsPairs.reduce(
    ([matchingKey, matchingValue], [key, value]) =>
      windowWidth && windowWidth >= value
        ? [key, value]
        : [matchingKey, matchingValue],
    breakpointsPairs[0]
  )
  return result
}

const isDesktopBreakpoint = (
  breakpoint: string,
  windowWidth: number | null = null
) => {
  const currentBreakpoint = breakpoint || getCurrentBreakpoint(windowWidth)
  return currentBreakpoint === 'l' || currentBreakpoint === 'xl'
}

const isTabletBreakpoint = (
  breakpoint: string,
  windowWidth: number | null = null
) => {
  const currentBreakpoint = breakpoint || getCurrentBreakpoint(windowWidth)
  return currentBreakpoint === 'm' || currentBreakpoint === 'ns'
}

const isMobileBreakpoint = (
  breakpoint: string,
  windowWidth: number | null = null
) => {
  const currentBreakpoint = breakpoint || getCurrentBreakpoint(windowWidth)
  return !currentBreakpoint || currentBreakpoint === 's'
}

const mediaQuery: MediaQueryGetter = (
  values: any,
  windowWidth?: Optional<number>
) => {
  if (isNil(windowWidth)) {
    windowWidth = window.innerWidth
  }

  // sets the smallest breakpoint as base in case the user doesnt set one
  const [firstBreakpointKey] = breakpointsPairs[0]

  if (!(firstBreakpointKey in values)) {
    const sortedValues = breakpointsPairs
      .map((breakpoint) => values[breakpoint[0]])
      .filter((value) => !isNil(value))

    const firstValue = sortedValues[0]
    values[firstBreakpointKey] = firstValue
  }

  // fill in gaps in the user values
  breakpointsPairs.forEach(([breakpoint], i) => {
    if (!(breakpoint in values)) {
      const previousBreakpoint = breakpointsPairs[i - 1]
      const [previousKey] = previousBreakpoint
      values[breakpoint] = values[previousKey]
    }
  })

  return values[getCurrentBreakpoint(windowWidth)]
}

export {
  mediaQuery,
  getCurrentBreakpoint,
  isDesktopBreakpoint,
  isTabletBreakpoint,
  isMobileBreakpoint,
}
