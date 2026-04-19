import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [resetSent,  setResetSent]  = useState(false);
  const [mode,       setMode]       = useState("login"); // "login" | "reset"

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message === "Invalid login credentials"
        ? "Incorrect email or password."
        : error.message);
    } else {
      navigate("/portal");
    }
    setLoading(false);
  }

  async function handleReset(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await resetPassword(email);
    if (error) setError(error.message);
    else setResetSent(true);
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-sidebar">
        <div className="auth-sidebar-content">
          <div className="auth-sidebar-logo">Sell<span>y</span></div>
          <div className="auth-sidebar-title">Welcome back</div>
          <div className="auth-sidebar-sub">
            Sign in to manage your Instagram shop, view orders, and access the Selly mobile app.
          </div>
          <div className="auth-feature-list">
            {["AI-powered Instagram DM replies", "Catalog built from Instagram posts", "Auto GST invoices on every order", "Customer analytics & promotions"].map(f => (
              <div key={f} className="auth-feature">
                <div className="auth-feature-dot" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-box">
          {mode === "login" ? (
            <>
              <h1 className="auth-form-title">Sign in</h1>
              <p className="auth-form-sub">
                Don't have an account? <Link to="/register">Create one free</Link>
              </p>

              {error && <div className="alert alert-error">{error}</div>}

              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div className="form-group">
                  <label className="form-label">Email address</label>
                  <input type="email" className="form-input" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
                </div>
                <div className="form-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label className="form-label">Password</label>
                    <button type="button" className="btn btn-ghost btn-sm"
                      style={{ fontSize: 13, padding: 0, color: "var(--purple)" }}
                      onClick={() => { setMode("reset"); setError(""); }}>
                      Forgot password?
                    </button>
                  </div>
                  <input type="password" className="form-input" placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary"
                  style={{ width: "100%", padding: 14 }} disabled={loading}>
                  {loading ? "Signing in…" : "Sign in →"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="auth-form-title">Reset password</h1>
              <p className="auth-form-sub">
                We'll send a reset link to your email.{" "}
                <a href="#" onClick={e => { e.preventDefault(); setMode("login"); setResetSent(false); setError(""); }}>
                  Back to sign in
                </a>
              </p>

              {error     && <div className="alert alert-error">{error}</div>}
              {resetSent && <div className="alert alert-success">Check your inbox — reset link sent!</div>}

              {!resetSent && (
                <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div className="form-group">
                    <label className="form-label">Email address</label>
                    <input type="email" className="form-input" placeholder="you@example.com"
                      value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
                  </div>
                  <button type="submit" className="btn btn-primary"
                    style={{ width: "100%", padding: 14 }} disabled={loading}>
                    {loading ? "Sending…" : "Send reset link"}
                  </button>
                </form>
              )}
            </>
          )}

          <div className="auth-footer-link">
            New here? <Link to="/register">Create a free account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
