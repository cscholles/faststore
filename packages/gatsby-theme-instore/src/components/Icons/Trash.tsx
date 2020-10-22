import React from 'react'

interface TrashIconProps {
  style?: Record<string, string>
  color?: string
  height?: number
  width?: number
  className?: string
}

export default function Trash({
  style,
  color = 'currentColor',
  height = 16,
  width = 16,
  className,
}: TrashIconProps) {
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
        d="M5 0.75C5 0.335785 5.33582 0 5.75 0H10.25C10.6642 0 11 0.335785 11 0.75V1H14.75C15.1642 1 15.5 1.33578 15.5 1.75C15.5 2.16422 15.1642 2.5 14.75 2.5H10.25C9.83582 2.5 9.5 2.16422 9.5 1.75V1.5H6.5V1.75C6.5 2.16422 6.16418 2.5 5.75 2.5H1.25C0.835815 2.5 0.5 2.16422 0.5 1.75C0.5 1.33578 0.835815 1 1.25 1H5V0.75Z"
        fill={color}
      />
      <path
        d="M2.75 4C3.16421 4 3.5 4.33579 3.5 4.75V13C3.5 13.8284 4.17157 14.5 5 14.5H11C11.8284 14.5 12.5 13.8284 12.5 13V4.75C12.5 4.33579 12.8358 4 13.25 4C13.6642 4 14 4.33579 14 4.75V13C14 14.6569 12.6569 16 11 16H5C3.34315 16 2 14.6569 2 13V4.75C2 4.33579 2.33579 4 2.75 4Z"
        fill={color}
      />
      <rect x="9" y="6" width="1" height="6" rx="0.5" fill={color} />
      <rect x="6" y="6" width="1" height="6" rx="0.5" fill={color} />
    </svg>
  )
}
