import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ResetPage() {
  const navigate = useNavigate();
  const [password,     setPassword]     = useState("");
  const [confirm,      setConfirm]      = useState("");
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [done,         setDone]         = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [checking,     setChecking]     = useState(true);

  useEffect(() => {
    // Supabase v2 password-reset flow:
    //   1. User clicks the emailed link → browser opens this page with a
    //      hash fragment containing the recovery tokens.
    //   2. The Supabase client parses the hash and fires onAuthStateChange
    //      with event "PASSWORD_RECOVERY".
    //   3. We use that session to call updateUser({ password }).
    //
    // getSession() alone does NOT see the recovery token on a fresh page load —
    // we must listen for the PASSWORD_RECOVERY event.

    let resolved = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        if (session) {
          setValidSession(true);
          setChecking(false);
          resolved = true;
        }
      }
    });

    // Fallback: if no recovery event fires within 3 s, check existing session
    const timer = setTimeout(async () => {
      if (!resolved) {
        const { data: { session } } = await supabase.auth.getSession();
        setValidSession(!!session);
        setChecking(false);
      }
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
    else { setDone(true); setTimeout(() => navigate("/portal"), 2000); }
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-sidebar">
        <div className="auth-sidebar-content">
          <div className="auth-sidebar-logo">Sell<span>y</span></div>
          <div className="auth-sidebar-title">Set a new password</div>
          <div className="auth-sidebar-sub">Choose a strong password for your Selly account.</div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-box">
          <h1 className="auth-form-title">New password</h1>
          <p className="auth-form-sub">Enter your new password below.</p>

          {done  && <div className="alert alert-success">Password updated! Redirecting…</div>}
          {error && <div className="alert alert-error">{error}</div>}

          {checking && !done && (
            <div style={{ textAlign: "center", padding: "20px 0", color: "var(--text-3)" }}>
              Verifying reset link…
            </div>
          )}

          {!checking && !validSession && !done && (
            <div className="alert alert-error">
              Invalid or expired reset link. <Link to="/login" style={{ color: "var(--purple)" }}>Request a new one</Link>.
            </div>
          )}

          {!checking && validSession && !done && (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="form-group">
                <label className="form-label">New password</label>
                <input type="password" className="form-input" placeholder="At least 8 characters"
                  value={password} onChange={e => setPassword(e.target.value)} required autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm password</label>
                <input type="password" className="form-input" placeholder="Repeat password"
                  value={confirm} onChange={e => setConfirm(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary"
                style={{ width: "100%", padding: 14 }} disabled={loading}>
                {loading ? "Saving…" : "Set new password"}
              </button>
            </form>
          )}

          <div className="auth-footer-link" style={{ marginTop: 24 }}>
            <Link to="/login">← Back to sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
