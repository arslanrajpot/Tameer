import React, { useEffect } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const DefaultLayout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (
      localStorage.getItem('auth_token') == null ||
      localStorage.getItem('sub') == null ||
      localStorage.getItem('email') == null ||
      localStorage.getItem('username') == null
    ) {
      navigate('/login')
      toast.error('You are not authenticated, please login first!')
    }
  }, [])
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
