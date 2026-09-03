import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './forget.css';
import axios from 'axios';

const Reset = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage('Invalid or missing reset token');
      return;
    }

    if (!password.trim()) {
      setMessage('Please enter a new password');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post(
        `https://my-backend-l1tz.onrender.com/resetpassword/${token}`,
        { newPassword: password.trim() },
        { withCredentials: true }
      );

      setIsSuccess(true);
      setMessage(res.data?.message || 'Password reset successful! Redirecting to login...');
      setPassword('');

      // 2 सेकंड बाद खुद लॉगिन पेज पर भेज देगा
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setIsSuccess(false);
      console.log('STATUS:', err.response?.status);
      console.log('DATA:', err.response?.data);
      setMessage(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="containt">
      <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2>Reset Password</h2>

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button 
          className="contain button" 
          type="submit" 
          disabled={loading || !password.trim()}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        {message && (
          <p style={{ color: isSuccess ? 'green' : 'red', marginTop: '10px', fontWeight: 'bold' }}>
            {message}
          </p>
        )}

        {isSuccess && (
          <Link to="/login" style={{ textDecoration: 'none', color: '#007bff' }}>
            Click here to Login
          </Link>
        )}
      </form>
    </div>
  );
};

export default Reset;