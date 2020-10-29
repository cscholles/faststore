import React, { FC } from 'react'

import TitleContainer from './Content/TitleContainer'
import SearchInputContainer from './Content/SearchInputContainer'
import DynamicPage from '../tkovs/DynamicPage.container'

const InStoreTopbar: FC = () => (
  <div>
    <div className="bg-base b--black-20 flex flex-column bb">
      <div className="pv4">
        <div className="flex w-100 justify-between">
          <div className="flex flex-auto items-center">
            <div className="relative flex flex-auto items-center h-100 w-100">
              <div className="f4 flex flex-grow-1 flex-shrink-1 noselectpl5">
                <TitleContainer value={3} />
                <DynamicPage />
              </div>
              <div className="w-40-l flex flex-auto flex-none-l mr5 title-logo">
                <SearchInputContainer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default InStoreTopbar
