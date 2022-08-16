import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilPaint,
  cilCasino,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // },
  },
  {
    component: CNavTitle,
    name: 'MAIN',
  },

  {
    component: CNavItem,
    name: 'All Projects',
    to: '/allProjects',
    icon: <CIcon icon={cilPaint} customClassName="nav-icon" />,
    disabled: false,
  },
  {
    component: CNavItem,
    name: 'Completed Projects',
    to: '/completedProjects',
    icon: <CIcon icon={cilPaint} customClassName="nav-icon" />,
    disabled: false,
  },
  {
    component: CNavItem,
    name: 'Running Projects',
    to: '/runningProjects',
    icon: <CIcon icon={cilCasino} customClassName="nav-icon" />,
    disabled: false,
  },
  {
    component: CNavItem,
    name: 'AddProject',
    to: '/addProject',
    icon: <CIcon icon={cilCasino} customClassName="nav-icon" />,
  },
]

export default _nav
