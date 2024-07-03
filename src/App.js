import React, { useEffect, useState } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout/Layout.jsx'
import Home from './components/Home/Home.jsx'
import About from './components/About/About.jsx'
import Register from './components/Register/Register.jsx'
import Login from './components/Login/Login.jsx'
import NotFound from './components/NotFound/NotFound.jsx'
import { jwtDecode } from 'jwt-decode'
import { ToastContainer } from 'react-toastify';
import { Offline, Online } from 'react-detect-offline'
import SendCode from './components/SendCode'
import ChangePassword from './components/ChangePassword/ChangePassword'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import ProtectedRouter from './components/ProtectedRouter/ProtectedRouter.jsx'
import UnProtectedRouter from './components/UnProtectedRouter/UnProtectedRouter.jsx'
import Physicians from './components/Physicians/Physicians.jsx'
import Specialty from './components/Specialty/Specialty.jsx'
import Profile from './components/Profile/Profile.jsx'
import Appointment from './components/Appointment/Appointment.jsx'
import MyAppointments from './components/MyAppointments/MyAppointments.jsx'
import AppointmentDetails from './components/AppointmentDetails/AppointmentDetails.jsx'
import WriteReview from './components/WriteReview/WriteReview.jsx'
import DoctorWorkingHours from './components/DoctorWorkingHours/DoctorWorkingHours.jsx'
import Blogs from './components/Blogs/Blogs.jsx'
import AdminDashboard from './components/Admin/AdminDashboard/AdminDashboard.jsx'
import JoiningRequests from './components/Admin/JoiningRequests/JoiningRequests.jsx'
import ManageDoctors from './components/Admin/ManageDoctors/ManageDoctors.jsx'
import ManagePatients from './components/Admin/ManagePatients/ManagePatients.jsx'
import Appointments from './components/Appointments/Appointments.jsx'


export default function App() {

  const [user, setUser] = useState(null);

  function saveCurrentUser() {
    let token = localStorage.getItem('Authorization');
    let decoded = jwtDecode(token);
    setUser(decoded);
  }

  const Admin = 'Admin';
  const Doctor = 'Doctor';
  const Patient = 'Patient';

  useEffect(() => {
  window.scrollTo(0, 0);
  if (localStorage.getItem('Authorization')) {
    saveCurrentUser();
  }
}, [])

let routers = createBrowserRouter([
  {
    path: '', element: <Layout user={user} setUser={setUser} />, children: [
      { index: true, element: <UnProtectedRouter><Home /></UnProtectedRouter> },
      { path: 'Register', element: <UnProtectedRouter><Register /></UnProtectedRouter> },
      { path: 'About', element: <UnProtectedRouter><About /></UnProtectedRouter> },
      { path: 'Physicians', element: <Physicians /> },
      { path: 'Blogs', element: <Blogs user={user} /> },
      { path: 'Dashboard', element: <ProtectedRouter><Dashboard user={user} /></ProtectedRouter> },
      { path: 'Profile/:id', element: <ProtectedRouter><Profile user={user} /></ProtectedRouter> },
      { path: 'Appointment/:id', element: <ProtectedRouter requiredRole={Patient}><Appointment user={user}  /></ProtectedRouter> },
      { path: 'Appointments/:id', element: <ProtectedRouter requiredRole={Admin}><Appointments user={user} /></ProtectedRouter> },
      { path: 'MyAppointments', element: <ProtectedRouter><MyAppointments user={user} /></ProtectedRouter> },
      { path: 'AppointmentDetails/:id', element: <ProtectedRouter><AppointmentDetails user={user} /></ProtectedRouter> },
      { path: 'WriteReview/:id', element: <ProtectedRouter requiredRole={Patient}><WriteReview user={user} /></ProtectedRouter> },
      { path: 'AdminDashboard', element: <ProtectedRouter requiredRole={Admin}><AdminDashboard /></ProtectedRouter> },
      { path: 'JoiningRequests', element: <ProtectedRouter requiredRole={Admin}><JoiningRequests /></ProtectedRouter> },
      { path: 'ManageDoctors', element: <ProtectedRouter requiredRole={Admin}><ManageDoctors /></ProtectedRouter> },
      { path: 'ManagePatients', element: <ProtectedRouter requiredRole={Admin}><ManagePatients /></ProtectedRouter> },
      { path: 'DoctorWorkingHours/:id', element: <ProtectedRouter requiredRole={Doctor}><DoctorWorkingHours user={user} /></ProtectedRouter> },
      { path: 'Specialty/:specialty', element: <ProtectedRouter><Specialty user={user} /></ProtectedRouter> },
      { path: 'Login', element: <UnProtectedRouter><Login saveCurrentUser={saveCurrentUser} /> </UnProtectedRouter> },
      { path: 'SendCode', element: <UnProtectedRouter><SendCode /></UnProtectedRouter> },
      { path: 'ChangePassword', element: <UnProtectedRouter><ChangePassword /></UnProtectedRouter> },
      { path: '*', element: <NotFound /> }
    ]
  }
])

return (
  <>
    <Offline>Only shown offline (surprise!)</Offline>
    <Online>

      <ToastContainer
        position="bottom-right" // Position of the toast notifications
        autoClose={2000} // Duration in milliseconds after which the toast will close automatically
        hideProgressBar={false} // Display or hide the progress bar
        newestOnTop={false} // Render newest toast notifications on top
        closeOnClick // Close the toast when clicked
        rtl={false} // Right-to-left layout
        pauseOnFocusLoss // Pause toast timer when the window loses focus
        draggable // Allow dragging to dismiss the toast
        pauseOnHover // Pause toast timer when hovered
      />
      <RouterProvider router={routers}></RouterProvider>

    </Online>
  </>
)
}
