import { useState } from "react";
import type { FormEvent } from "react";
import { LOGIN_SECRET } from "../config";
import { setAuthenticated } from "../auth";
import "./LoginScreen.css";

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = secret.trim();
    if (!trimmed) {
      setError("Please enter the login secret.");
      return;
    }
    if (trimmed !== LOGIN_SECRET) {
      setError("Invalid key.");
      return;
    }
    setAuthenticated();
    onLogin();
  };

  return (
    <div className="login-screen">
      <div className="login-screen-card">
        <h1 className="login-screen-title">Login</h1>
        <p className="login-screen-subtitle">Enter your login secret to continue</p>
        <form onSubmit={handleSubmit} className="login-screen-form">
          <input
            type="password"
            value={secret}
            onChange={(e) => {
              setSecret(e.target.value);
              setError("");
            }}
            placeholder="Login Secret"
            className="login-screen-input"
            autoFocus
            autoComplete="current-password"
          />
          {error && <p className="login-screen-error">{error}</p>}
          <button type="submit" className="login-screen-submit">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
