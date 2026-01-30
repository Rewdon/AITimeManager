import React, { useState } from 'react';
import { Bot, Zap, Coffee, ArrowRight } from 'lucide-react';
import AuthModal from '../components/auth/AuthModal';

const LandingPage = () => {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-text-main">
      
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
          <Bot className="text-primary" />
          <span>AI Time Mgr</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => openAuth('login')}
            className="text-text-muted hover:text-text-main font-medium transition-colors"
          >
            Zaloguj się
          </button>
          <button 
            onClick={() => openAuth('register')}
            className="hidden sm:block bg-surface hover:bg-surfaceHover text-text-main px-4 py-2 rounded-lg border border-border transition-all"
          >
            Rejestracja
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-20 pb-32 text-center relative">
        
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary rounded-full blur-3xl opacity-20 -z-10 animate-pulse"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-10 border border-primary-20 text-primary text-sm mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Sztuczna inteligencja, która planuje za Ciebie
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Odzyskaj kontrolę <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple">
            nad swoim czasem
          </span>
        </h1>

        <p className="text-xl text-text-muted max-w-2xl mx-auto mb-10">
          Przestań zgadywać. Nasz algorytm AI automatycznie sortuje i priorytetyzuje Twoje zadania.
        </p>

        <div className="flex justify-center">
          <button 
            onClick={() => openAuth('register')}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-text-main transition-all duration-200 bg-primary rounded-full hover:bg-primary-hover shadow-primary hover:shadow-primary-hover"
          >
            Wypróbuj za darmo
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left">
          <FeatureCard 
            icon={<Bot className="text-primary" size={32} />}
            title="Analiza AI"
            desc="Sztuczna inteligencja analizuje treść zadania i decyduje o jego typie i czasie trwania."
          />
          <FeatureCard 
            icon={<Zap className="text-yellow" size={32} />}
            title="Zadania Aktywne"
            desc="Zadania wymagające Twojego pełnego skupienia są priorytetyzowane w blokach pracy."
          />
          <FeatureCard 
            icon={<Coffee className="text-blue" size={32} />}
            title="Zadania Pasywne"
            desc="Wrzuć pranie, puść renderowanie. Wykorzystaj czas, gdy rzeczy robią się same."
          />
        </div>
      </main>

      <footer className="border-t border-border py-8 text-center text-text-muted text-sm bg-background">
        <p>&copy; 2024 AI Time Manager.</p>
      </footer>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-6 rounded-2xl bg-surface-50 border border-border hover:border-primary-50 transition-colors">
    <div className="mb-4 bg-background w-12 h-12 rounded-lg flex items-center justify-center border border-border">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-text-main">{title}</h3>
    <p className="text-text-muted leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;