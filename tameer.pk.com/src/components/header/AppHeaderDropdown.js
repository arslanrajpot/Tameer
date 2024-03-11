import React from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilFile, cilLockLocked, cilSettings } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'
import { useDispatch, useSelector } from 'react-redux'
import { logout, setLoading } from 'src/store/slices/main'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const AppHeaderDropdown = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const logoutUser = () => {
    dispatch(setLoading(true))
    dispatch(logout())
    navigate('/login')
    toast.info('Logged Out!')
    dispatch(setLoading(false))
  }
  const state = useSelector((state) => state.main)
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        {/* <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader> */}
        {/* <CDropdownItem>
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem> */}
        <CDropdownItem href="/allProjects">
          <CIcon icon={cilFile} className="me-2" />
          Projects
          <CBadge color="success" className="ms-2">
            {state.projects?.length || 0}
          </CBadge>
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={logoutUser}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
