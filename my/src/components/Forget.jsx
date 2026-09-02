
import React, { useState } from "react";
import axios from "axios";
import "./forget.css";

const Forget = () => {

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                "https://my-backend-l1tz.onrender.com/forgotpassword",
                {
                    email: email
                },
                {
                    withCredentials: true
                }
            );

            setMessage(res.data.message);

            console.log(res.data);

        } catch (err) {

            console.log(err);

            setMessage(
                err.response?.data?.message || "Something went wrong"
            );
        }
    };

    return (
        <div className="forget">
         
            <h1>Forgot Password</h1>

            <form onSubmit={handleSubmit} className="contain" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <button type="submit">
                    Submit
                </button>

            </form>

            {message && <p>{message}</p>}

        </div>
    );
};

export default Forget;

