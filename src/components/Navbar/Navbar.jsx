import React from 'react'
import myImage from '../../images/MediConnectProLogo.jpeg';
import { Link, useLocation } from 'react-router-dom'; // Import Link and useLocation
import './Navbar.css'; // Import the CSS file with navbar styles
import Swal from 'sweetalert2'


export default function Navbar({ user, logout }) {
  const location = useLocation(); // Get the current location pathname

  function logoutApprove() {
    Swal.fire({
      title: "Are you sure you want to log out?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!"
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
          <a className="navbar-brand" href="#"><img src={myImage} alt="MediConnectPro Logo" height={60} /></a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {user ? <>
                <li className="nav-item">
                  <Link to="Dashboard" className={location.pathname === '/Dashboard' ? 'nav-link active' : 'nav-link'}>Dashboard</Link>
                </li>
              </> :
                <>
                  <li className="nav-item">
                    <Link to="" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'} >Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="About" className={location.pathname === '/About' ? 'nav-link active' : 'nav-link'} >About Us</Link>
                  </li>
                </>
              }
              <li className="nav-item">
                <Link to="Physicians" className={location.pathname === '/Physicians' ? 'nav-link active' : 'nav-link'} >Physicians & Providers</Link>
              </li>
            </ul>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {user ? <>
                <li className="nav-item">
                  <Link to="Blogs" className={location.pathname === '/Blogs' ? 'nav-link active' : 'nav-link'} >Blogs</Link>
                </li>
                <li className="nav-item">
                  <Link to={`/Profile/${user.id}`} className={location.pathname === `/Profile/${user.id}` ? 'nav-link active' : 'nav-link'}>My Profile</Link>
                </li>
                {
                  user?.isAdmin ?
                    <>
                      <li className="nav-item">
                        <Link to="AdminDashboard" className={location.pathname === '/AdminDashboard' ? 'nav-link active' : 'nav-link'} >Admin Dashboard</Link>
                      </li>
                    </> : <>
                      <li className="nav-item">
                        <Link to="MyAppointments" className={location.pathname === '/MyAppointments' ? 'nav-link active' : 'nav-link'} >My Appointments</Link>
                      </li>
                    </>
                }
                <li className="nav-item">
                  <p className="nav-link" onClick={logoutApprove} style={{ cursor: 'pointer' }}>Logout</p>
                </li>
              </> :
                <>
                  <li className="nav-item">
                    <Link to="Login" className={location.pathname === '/Login' ? 'nav-link active' : 'nav-link'} >Log in</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="Register" className={location.pathname === '/Register' ? 'nav-link active' : 'nav-link'} >Register</Link>
                  </li>
                </>
              }
            </ul>
          </div>
        </div>
      </nav>
      <img src="../../src/images/MediConnectProLogo.jpeg" alt="" />
    </>
  )
}
