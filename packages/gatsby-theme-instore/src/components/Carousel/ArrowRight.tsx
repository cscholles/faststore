/** @jsx jsx */
import { Button, jsx } from '@vtex/store-ui'
import { FC } from 'react'

interface Props {
  onClick: () => void
}

const CarouselArrowRight: FC<Props> = ({ onClick }) => (
  <Button
    onClick={onClick}
    sx={{ position: 'absolute', top: '50%', right: 0, zIndex: 1 }}
    backgroundColor="transparent"
    color="black"
    aria-label="Next Carousel Image"
  >
    <svg
      fill="none"
      width="25"
      height="25"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <use href="#nav-thin-caret--right" xlinkHref="#nav-thin-caret--right">
        <g id="nav-thin-caret--right">
          <path
            d="M5 15L12 8L5 1"
            stroke="currentColor"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </use>
    </svg>
  </Button>
)

export default CarouselArrowRight
