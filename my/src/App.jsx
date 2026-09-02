import { useState } from 'react'
import './App.css'
import My from './My'
import Router from './routes/RouterTest'

function App() {
  const [cartItems, setCartItems] = useState([])

 

  return(
    <>
      <Router />
    </>
  )
}

export default App
