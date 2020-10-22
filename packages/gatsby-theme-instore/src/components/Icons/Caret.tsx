import React from 'react'

interface CaretIconProps {
  style?: Record<string, string>
  color?: string
  height?: number
  width?: number
  className?: string
}

export default function Caret({
  style,
  color = 'currentColor',
  height = 16,
  width = 16,
  className,
}: CaretIconProps) {
  const styleIcon = {
    fill: color,
    verticalAlign: 'middle',
    ...style,
  }
  return (
    <svg
      className={className || 'c-action-primary'}
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={styleIcon}>
      <path
        d="M13.9567 4.79117C14.3478 5.17939 14.3478 5.80883 13.9567 6.19706L9.06215 11.0632C8.47553 11.6456 7.52445 11.6456 6.93785 11.0632L2.0433 6.19706C1.65223 5.80883 1.65223 5.17939 2.0433 4.79117C2.43438 4.40294 3.06843 4.40294 3.4595 4.79117L8 9.30589L12.5405 4.79117C12.9316 4.40294 13.5656 4.40294 13.9567 4.79117Z"
        fill={color}
      />
    </svg>
  )
}
