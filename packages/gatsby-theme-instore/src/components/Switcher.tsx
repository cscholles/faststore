import PropTypes from 'prop-types'
import React, { FC, MouseEvent } from 'react'
import classNames from 'classnames'

interface Option {
  id: number
  label: string
}

type SwitcherProps = {
  options: Option[]
  loading: number
  selected: number
  onSelect?: (e: MouseEvent, ...rest: any[]) => void
}

export const Switcher: FC<SwitcherProps> = ({
  options,
  selected,
  onSelect = () => {},
  ...rest
}) => {
  return (
    <div className="tc" {...rest}>
      {options.map((option, i) => {
        const isSelected = i === selected || selected === option.id
        const isFirst = i === 0
        const isLast = i === options.length - 1
        return (
          <button
            id={`switcher-${option.id}`}
            type="button"
            key={`option-${option.id}`}
            className={`switcher-option dib pointer bn ${classNames({
              'br2 br--left': isFirst,
            })} ${classNames({ 'br2 br--right': isLast })} ${
              isSelected ? 'white' : 'black-40'
            } ${isSelected ? 'bg-action-primary' : 'bg-black-10'} ${
              options ? 'ph5 f6 f4-ns f6-l pv3 lh-copy-ns' : 'h1 h2-ns w1 w2-ns'
            } nowrap`}
            onClick={(event) => onSelect(event, option.id, i)}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
