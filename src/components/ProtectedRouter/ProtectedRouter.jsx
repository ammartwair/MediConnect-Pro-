import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRouter({children}) {

    if (localStorage.getItem('userToken')){
        return <>{children}</>
    }else{
        return <Navigate to = '/Login'></Navigate>
    }
 
}
