import React, { useEffect, useState } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './components/Home/Home'
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import Products from './components/Products/Products'
import NotFound from './components/NotFound/NotFound'
import Cart from './components/Cart/Cart'
import { jwtDecode } from 'jwt-decode'
import ProtectedRouter from './components/ProtectedRouter/ProtectedRouter'
import ProductDetails from './components/ProductDetails/ProductDetails'
import { CartContextProvider } from './components/Context/CartStore'
import { ToastContainer } from 'react-toastify';
import { Offline, Online } from 'react-detect-offline'
import SendCode from './components/SendCode'
import ChangePassword from './components/ChangePassword/ChangePassword'

export default function App() {
  let [user, setUser] = useState(null);
  function saveCurrentUser() {

    let token = localStorage.getItem('userToken');
    let decoded = jwtDecode(token);
    setUser(decoded);
  }

  useEffect(() => {
    if (localStorage.getItem('userToken')) {
      saveCurrentUser();
    }
  }, [])


  let routers = createBrowserRouter([
    {
      path: '', element: <Layout user={user} setUser={setUser} />, children: [
        { index: true, element: <Home /> },
        { path: 'Register', element: <Register /> },
        { path: 'Login', element: <Login saveCurrentUser={saveCurrentUser} /> },
        { path: 'Products', element: <Products /> },
        { path: 'Product/:slug', element: <ProductDetails /> },
        { path: 'Cart', element: <Cart /> },
        { path: 'SendCode', element: <SendCode /> },
        { path: 'ChangePassword', element: <ChangePassword /> },
        { path: '*', element: <NotFound /> }
      ]
    }
  ])

  return (
    <>
      <Offline>Only shown offline (surprise!)</Offline>
      <Online>
      <CartContextProvider>
        <ToastContainer />
        <RouterProvider router={routers}></RouterProvider>
      </CartContextProvider>
      </Online>
    </>
  )
}

// <ProtectedRouter><Cart /></ProtectedRouter>