import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

function PrivateRoutes() {
  const token = useSelector((state)=>  state.reducer.userdata)
  const verified = token.isAnonymous
    return (
        verified ? <Navigate to='/'/> : <Outlet/>
  )
}

export default PrivateRoutes