import React, { useEffect } from 'react'
import Navbar from '../Navbar/Navbar.jsx'
import Footer from '../Footer/Footer.jsx'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import './Layout.css'

export default function Layout({ user, setUser }) {
  let Navigate = useNavigate();
  function logout() {
    localStorage.removeItem('Authorization');
    setUser(null);
    Navigate('/Login');
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <div className='all'>
      <Navbar user={user} logout={logout} />
      <div className="layout">
        <Outlet></Outlet>
      </div>
      <Footer />
    </div>
  )
}
