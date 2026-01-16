import { useState } from "react";
import api from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setToken("");

      const res = await api.post("/api/v1/auth/login", { email, password });

      // expecting: { accessToken: "..." }
      setToken(res.data.accessToken);
      console.log("LOGIN SUCCESS:", res.data);
    } catch (err) {
      console.log("error", err.response.data);
      setError(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 400 }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 10 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 10 }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: 10 }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {token && (
        <div style={{ marginTop: 10 }}>
          <p>
            <b>Access Token:</b>
          </p>
          <p style={{ wordBreak: "break-all" }}>{token}</p>
        </div>
      )}
    </div>
  );
}

export default Login;
