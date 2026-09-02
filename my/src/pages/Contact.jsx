import React, { useState } from 'react'
import axios from 'axios'

const Contact = () => {
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")

  

    

    const handleContact = async (e) => {
        e.preventDefault()

        if (email.trim() === "" || phone.trim() === "") {
            alert("Please fill all the fields")
            return
        }
        console.log({ email, phone })

        try {
            const res = await axios.post("https://my-backend-l1tz.onrender.com/contact", { email, phone })
            console.log(res)
            setEmail("")
            setPhone("")
        }
        catch (err) {
            console.log(err)

        }
    }

    return (
        <div className='container'>
            <form className='containt'  onSubmit={handleContact}>
                <h1 className='text-center mb-4' style={{ color: "white" }}>Contact Us</h1>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPhone" className="form-label">Phone number</label>
                    <input
                        type="tel"
                        className="form-control"
                        id="exampleInputPhone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                    <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                </div>
                <button type="submit" className="btn btn-primary w-100">Submit</button>
            </form>
        </div>
    )
}

export default Contact
