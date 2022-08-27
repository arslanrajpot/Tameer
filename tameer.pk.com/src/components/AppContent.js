import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import { useSelector } from 'react-redux'

// routes config
import routes from '../routes'

const AppContent = () => {
  const loadingState = useSelector((state) => state.main.loading)
  return (
    <CContainer lg>
      {loadingState && (
        <div className="text-center mt-2 mb-2">
          <CSpinner color="primary" />
        </div>
      )}
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
          {/* <Route path="/" element={<Navigate to="dashboard" replace />} /> */}
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
