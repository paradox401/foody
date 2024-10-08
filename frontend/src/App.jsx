import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import FAQ from './pages/FAQ/FAQ'
import UserProfile from './components/UserProfile/UserProfile'
import NotFound from './components/NotFound/NotFound'




const App = () => {
const [showLogin,setShowLogin] = useState(false)

  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
    <div className='app'>
      <Navbar setShowLogin = {setShowLogin} />
      <Routes>
        <Route path='/foody/' element = {<Home/>}/>
        <Route path='/foody/cart' element = {<Cart/>}/>
        <Route path='/foody/order' element = {<PlaceOrder/>}/>
        <Route path='/profile' element={<UserProfile/>} />
        <Route path='/faq' element = {<FAQ />} />
        <Route path="*" element={<NotFound />} /> {/* Fallback route */}

      </Routes>
    </div>
    <Footer></Footer>
    </>
  )
}

export default App