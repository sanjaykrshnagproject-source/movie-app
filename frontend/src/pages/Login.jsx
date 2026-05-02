import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg = err.response?.data?.msg || err.message || "Login failed";
      alert(errorMsg);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>MyMovies</h1>
        <form onSubmit={handleSubmit}>
          <h2>Sign In</h2>
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
          <button type="submit">Sign In</button>
          <p>
            New to MyMovies? <Link to="/register">Sign up now.</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
