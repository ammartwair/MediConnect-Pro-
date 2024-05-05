import React from 'react'
import Navbar from '../Navbar/Navbar.jsx'
import Footer from '../Footer/Footer.jsx'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'

export default function Layout({user, setUser}) {
  let Navigate = useNavigate();
  function logout(){
    localStorage.removeItem('userToken');
    setUser(null);
    Navigate('/Login');
  }
  return (
    <>
    <Navbar user={user} logout={logout} />
    <div className="container">
    <Outlet></Outlet>
    </div>
    <Footer />
    </>
  )
}
