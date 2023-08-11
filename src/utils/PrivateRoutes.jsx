import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

function PrivateRoutes() {
  const token = useSelector((state)=>  state.reducer.isAuthenticated)
    return (
        token ?  <Outlet/> : <Navigate to='/'/>
  )
}

export default PrivateRoutes