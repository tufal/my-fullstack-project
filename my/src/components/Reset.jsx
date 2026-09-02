import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import './forget.css'
import axios from 'axios'

const Reset = () => {
  const { token } = useParams()
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const reset = async () => {
    if (!token) {
      setMessage('Invalid reset token')
      return
    }

    try {
      const res = await axios.post(
        `http://localhost:3000/resetpassword/${token}`,
        { newPassword: password },
        { withCredentials: true }
      )
      setMessage(res.data?.message || 'Password reset successful')
    } catch (err) {
      console.log('ERROR:', err)
      console.log('STATUS:', err.response?.status)
      console.log('DATA:', err.response?.data)
      setMessage(err.response?.data?.message || err.message || 'Something went wrong')
    }
  }

  return (
    <div className="containt">
   
      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={reset} className='contain button' type='submit'>Reset Password</button>
      
      {message && <h1>{message}</h1>}
    </div>
  )
}

export default Reset
