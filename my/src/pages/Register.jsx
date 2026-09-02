import React, { createRef } from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Register = () => {
  const inputref = createRef();
  const navigate = useNavigate();
  const [Form, setForm] = useState({
    Name: "",
    Email: "",
    Password: "",
    
  });
  

  const handlesubmit =async(e) =>{
    e.preventDefault();
    
    if(!Form.Name || !Form.Email || !Form.Password ){
      alert("Please fill all the fields");
      return;
    }
    
    console.log(Form);
    localStorage.setItem("name", Form.Name);
localStorage.setItem("email", Form.Email);
 
    console.log({ Name: Form.Name, Email: Form.Email, Password: Form.Password });
    
      try {
            const res = await axios.post("https://my-backend-l1tz.onrender.com/register", { email: Form.Email, name: Form.Name, password: Form.Password });
            console.log(res);
        } catch (err) {
            console.log(err);
        } finally {
            setForm({
              Name: "",
              Email: "",
              Password: "",
            });
        }
    alert("Registration successful");
    navigate("/Login");
  }

  return (
    
    <div className='container mt-5 d-flex justify-content-center align-items-center' style={{ minHeight: "80vh" }}>
      <form className='containt'  style={{ borderRadius: "20px" }} onSubmit={handlesubmit}>
        <div className="mb-3 ">
            <label htmlFor="name" className="form-label text-light">Name</label>
            <input type="text" className="form-control" id="name" placeholder="Enter your name" value={Form.Name} onChange={(e) => setForm({...Form, Name: e.target.value})} required />
        </div>
        <div className="mb-3">
            <label htmlFor="email" className="form-label text-light">Email address</label>
            <input type="email" className="form-control" id="email" placeholder="Enter your email" value={Form.Email} onChange={(e) => setForm({...Form, Email: e.target.value})} required />
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label text-light">Password</label>
            <input type="password" className="form-control" id="password" placeholder="Enter your password" maxLength={10} value={Form.Password} onChange={(e) => setForm({...Form, Password: e.target.value})} required />
        </div>
        
        <button type="submit" className="btn btn-primary" >Register</button>
      </form>
      

       
    </div>
   
  )
}

export default Register
