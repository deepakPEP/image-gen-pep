import { useState } from "react";
import { LOGIN_SECRET } from "./config";
import { isAuthenticated, clearSession } from "./auth";
import LoginScreen from "./components/LoginScreen";
import ChatPage from "./pages/ChatPage";
import "./App.css";

function App() {
  const loginRequired = LOGIN_SECRET.length > 0;
  const [authenticated, setAuthenticated] = useState(() =>
    loginRequired ? isAuthenticated() : true
  );

  const handleLogin = () => setAuthenticated(true);

  const handleLogout = () => {
    clearSession();
    setAuthenticated(false);
  };

  if (loginRequired && !authenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      {loginRequired && (
        <header className="app-header">
          <div className="app-header-inner" />
          <button
            type="button"
            className="app-header-logout"
            onClick={handleLogout}
            title="Logout"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </header>
      )}
      <main className="app-main">
        <ChatPage />
      </main>
    </div>
  );
}

export default App;