import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export function Topbar() {
  const { user, token, login, logout, isLoading, error } = useAuthStore();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      setShowLogin(false);
      setPassword('');
    } catch {
      /* error is shown from the store */
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">G</span>
          <span>GIT<span>Logistics</span></span>
        </div>
        <nav>
          <a href="#home" onClick={() => scrollTo('home')}>Home</a>
          <a href="#track" onClick={() => scrollTo('track')}>Track Order</a>
          <a href="#services" onClick={() => scrollTo('services')}>Services</a>
          <a href="#dashboard" onClick={() => scrollTo('dashboard')}>Dashboard</a>
        </nav>
        <div className="top-actions">
          {token ? (
            <>
              <span className="topbar-user">👤 {user?.name ?? 'Ops User'}</span>
              <button className="btn btn-light" onClick={() => void logout()}>Logout</button>
            </>
          ) : (
            <button className="btn btn-light" onClick={() => { useAuthStore.setState({ error: null }); setShowLogin(true); }}>Login</button>
          )}
          <button className="btn btn-primary" onClick={() => scrollTo('track')}>Track Package</button>
        </div>
      </header>

      {showLogin && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && setShowLogin(false)}>
          <div className="modal-card" style={{ maxWidth: 420 }}>
            <div className="modal-head">
              <h3>Operations Login</h3>
              <button type="button" aria-label="Close login" onClick={() => setShowLogin(false)}>×</button>
            </div>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {error && <p className="form-error" role="alert">{error}</p>}
              <label className="field-label">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="ops@gitlogistics.ng"
                />
              </label>
              <label className="field-label">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </label>
              <div className="modal-actions" style={{ marginTop: 8 }}>
                <button type="button" className="btn btn-light" onClick={() => setShowLogin(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? 'Signing in…' : 'Sign In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
