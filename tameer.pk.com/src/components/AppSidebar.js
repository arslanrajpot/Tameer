import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarNav, CSidebarToggler } from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../_nav'
import { setSidebarFolded, setSidebarShow } from 'src/store/slices/main'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const folded = useSelector((state) => state.main.sidebarFolded)
  const sidebarShow = useSelector((state) => state.main.sidebarShow)

  return (
    <CSidebar
      position="fixed"
      unfoldable={folded}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch(setSidebarShow(visible))
      }}
    >
      {/* <CSidebarBrand className="d-none d-md-flex" to="/">
        <CIcon className="sidebar-brand-full" icon={logoNegative} height={35} />
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} />
      </CSidebarBrand> */}
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch(setSidebarFolded(!folded))}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
