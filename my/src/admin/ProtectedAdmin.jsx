import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedAdmin = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        axios.get("https://my-backend-l1tz.onrender.com/profile", {
            withCredentials: true,
            headers: localStorage.getItem("authToken")
                ? { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
                : undefined
        })
        .then((res) => {
            if (res.data.user.role === "admin") {
                setIsAdmin(true);
            }
            setLoading(false);
        })
        .catch(() => {
            setLoading(false);
        });
    }, []);

    if (loading) return <h2>Loading...</h2>;

    return isAdmin ? children : <Navigate to="/Login" replace />;
};

export default ProtectedAdmin;