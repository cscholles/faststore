import React from 'react'

interface CaretIconProps {
  style?: Record<string, string>
  color?: string
  height?: number
  width?: number
}

export default function Inventory({
  style,
  color = 'currentColor',
  height = 24,
  width = 24,
}: CaretIconProps) {
  const styleIcon = {
    fill: color,
    verticalAlign: 'middle',
    ...style,
  }
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={styleIcon}>
      <path
        d="M8.5 5.25C8.08579 5.25 7.75 5.58579 7.75 6V9C7.75 9.41421 8.08579 9.75 8.5 9.75C8.91421 9.75 9.25 9.41421 9.25 9V6.75H10.75V7C10.75 7.41421 11.0858 7.75 11.5 7.75H12.5C12.9142 7.75 13.25 7.41421 13.25 7V6.75H14.75V9C14.75 9.41421 15.0858 9.75 15.5 9.75C15.9142 9.75 16.25 9.41421 16.25 9V6C16.25 5.58579 15.9142 5.25 15.5 5.25H8.5Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.25 12C4.25 11.5858 4.58579 11.25 5 11.25H12C12.4142 11.25 12.75 11.5858 12.75 12V17.25H18.25V12.75H16.75V13C16.75 13.4142 16.4142 13.75 16 13.75H15C14.5858 13.75 14.25 13.4142 14.25 13V12C14.25 11.5858 14.5858 11.25 15 11.25H19C19.4142 11.25 19.75 11.5858 19.75 12V17.25H22C22.4142 17.25 22.75 17.5858 22.75 18C22.75 18.4142 22.4142 18.75 22 18.75H2C1.58579 18.75 1.25 18.4142 1.25 18C1.25 17.5858 1.58579 17.25 2 17.25H4.25V12ZM5.75 17.25H11.25V12.75H9.75V13C9.75 13.4142 9.41421 13.75 9 13.75H8C7.58579 13.75 7.25 13.4142 7.25 13V12.75H5.75V17.25Z"
        fill={color}
      />
    </svg>
  )
}
