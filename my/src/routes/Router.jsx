import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import Register from '../pages/Register';

import Shop from '../pages/Shop';
import Logout from '../pages/Logout';
import Admin from '../admin/Admin';
import ProtectedAdmin from '../admin/ProtectedAdmin';
import Cart from '../pages/Cart';
import Forget from '../components/forget';
import Reset from '../components/Reset';


const Router = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='about' element={<About />} />
            <Route path='contact' element={<Contact />} />
            <Route path='Login' element={<Login />} />
            <Route path='Register' element={<Register />} />
            <Route path='Shop' element={<Shop  />} />
            <Route path="Cart" element={<Cart />} />
            <Route path="Register" element={<Register />} />
            <Route path="Login" element={<Login />} />
            <Route path="Logout" element={<Logout />} />
            <Route path="Forget" element={<Forget />} />
            <Route path="resetpassword/:token" element={<Reset />} />
        <Route 
    path="/Admin"
    element={
        <ProtectedAdmin>
            <Admin />
        </ProtectedAdmin>
    }
/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default Router
