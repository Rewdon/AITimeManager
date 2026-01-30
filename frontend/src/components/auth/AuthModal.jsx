import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, X, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [isLoginMode, setIsLoginMode] = useState(initialMode === 'login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoginMode(initialMode === 'login');
    setError('');
    setFormData({ name: '', email: '', password: '' });
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const endpoint = isLoginMode ? '/auth/login' : '/auth/register';

    try {
      const response = await api.post(endpoint, formData);
      const { token, ...userData } = response.data;
      
      login(userData, token);
      onClose();
      navigate('/dashboard');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Wystąpił błąd. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-main hover:bg-surfaceHover rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-text-main mb-2">
            {isLoginMode ? 'Witaj ponownie' : 'Dołącz do nas'}
          </h2>
          <p className="text-text-muted text-sm">
            {isLoginMode ? 'Zaloguj się do AI Time Manager' : 'Rozpocznij darmowy okres próbny'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-danger-background border border-danger-border text-danger-light text-sm rounded-lg flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-danger" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isLoginMode && (
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1 uppercase">Imię</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-text-main focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="Jan Kowalski"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-text-muted mb-1 uppercase">Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary">
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-text-main focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="twoj@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-muted mb-1 uppercase">Hasło</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary">
                <Lock size={18} />
              </div>
              <input
                type="password"
                name="password"
                required
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-text-main focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-primary hover:bg-primary-hover text-text-main font-semibold py-3.5 rounded-xl transition-all shadow-primary hover:shadow-primary-hover flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : isLoginMode ? 'Zaloguj się' : 'Utwórz konto'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center">
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-sm text-text-muted hover:text-primary transition-colors flex items-center justify-center gap-1 mx-auto"
          >
            {isLoginMode ? 'Nie masz konta? Zarejestruj się' : 'Masz już konto? Zaloguj się'}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;