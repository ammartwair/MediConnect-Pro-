import React from 'react'
import { Navigate } from 'react-router-dom'

export default function UnProtectedRouter({children}) {

    if (!localStorage.getItem('Authorization')){
        
        return <>{children}</>
    }else{
        return <Navigate to = '/Dashboard'></Navigate>
    }
 
}
