import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      console.error("Register error:", err);
      const errorMsg = err.response?.data?.msg || err.message || "Registration failed";
      alert(errorMsg);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>MyMovies</h1>
        <form onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
          <input 
            placeholder="Username" 
            required
            onChange={e=>setForm({...form, username:e.target.value})}
          />
          <input 
            type="email" 
            placeholder="Email address" 
            required
            onChange={e=>setForm({...form, email:e.target.value})}
          />
          <input 
            type="password" 
            placeholder="Password" 
            required
            onChange={e=>setForm({...form, password:e.target.value})}
          />
          <button type="submit">Get Started</button>
          <p>
            Already have an account? <Link to="/login">Sign in now.</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
