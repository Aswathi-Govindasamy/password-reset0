import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // 🔴 VERY IMPORTANT
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN SUCCESS:", res.data);
      navigate("/hello"); // ✅ redirect
    } catch (err) {
      console.log("LOGIN ERROR:", err.response);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Login</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="btn btn-primary w-100 mb-3">
          Login
        </button>
      </form>

      <div className="d-flex justify-content-between">
        <Link to="/forgot-password">Forgot Password?</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
