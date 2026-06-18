import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuth } from '../lib/auth';
import { Lock, Sparkles, User, KeySquare } from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../lib/supabase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [birthdayName, setBirthdayName] = useState('Melissa');

  useEffect(() => {
    // If already authenticated, redirect straight to workspace dashboard
    if (adminAuth.isAuthenticated()) {
      navigate('/admin');
    }

    // Fetch birthday girl's first name dynamically
    db.getSettings().then(settings => {
      if (settings?.birthday_name) {
        setBirthdayName(settings.birthday_name.split(' ')[0]);
      }
    }).catch(err => console.error(err));
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Por favor preencha todos os campos!');
      setLoading(false);
      return;
    }

    try {
      const result = await adminAuth.login(username.trim(), password);
      if (result.success) {
        navigate('/admin');
      } else {
        setErrorMsg(result.message || 'Dados incorretos. Tente novamente.');
      }
    } catch (err) {
      setErrorMsg('Erro inesperado de comunicação com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-center items-center px-4 font-sans select-none">
      
      {/* Decorative leaf/forest branches floating background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none select-none">
        <svg viewBox="0 0 100 100" fill="currentColor" className="text-emerald-800 w-full h-full">
          <path d="M10,0 C30,30 20,70 0,90 C10,60 50,40 10,0 Z" />
        </svg>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white p-8 rounded-[35px] border border-[#FAF0EE] shadow-2xl space-y-6 relative border-t-8 border-t-[#E66C86]"
      >
        {/* visual header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E66C86]/5 mb-1">
            <span className="text-3xl">🔑</span>
          </div>
          <h2 className="text-xl font-black text-amber-955 uppercase tracking-wider">Acesso da Administração</h2>
          <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-xs mx-auto">
            Apenas para Papais e Organizadores modificarem detalhes do convite de aniversário de <strong>{birthdayName}</strong>.
          </p>
        </div>

        {/* login form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Username input box */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block">E-mail de Usuário</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Seu e-mail"
                className="w-full pl-10 pr-4 py-2.5 text-xs border rounded-2xl focus:outline-none focus:border-[#E66C86] font-semibold text-gray-700 bg-[#FAF6F0]/20"
              />
              <User size={14} className="absolute left-3.5 top-3.5 text-gray-450" />
            </div>
          </div>

          {/* Password secure text input box */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block">Selo de Senha</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                className="w-full pl-10 pr-4 py-2.5 text-xs border rounded-2xl focus:outline-none focus:border-[#E66C86] font-semibold text-gray-700 bg-[#FAF6F0]/20"
              />
              <KeySquare size={14} className="absolute left-3.5 top-3.5 text-gray-450" />
            </div>
          </div>

          {/* error box warning */}
          {errorMsg && (
            <div className="p-3 bg-red-50 rounded-2xl text-[11px] font-bold text-red-700 leading-normal border border-red-100 text-center">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Action trigger button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#E66C86] hover:brightness-105 active:scale-98 text-white rounded-2xl text-xs font-bold tracking-wider uppercase transition-all shadow-md mt-1 cursor-pointer flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Validando...</span>
                </>
              ) : (
                <>
                  <Lock size={12} />
                  <span>Entrar no Painel</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Back link */}
        <div className="text-center pt-2">
          <a
            href="/"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 tracking-wide"
          >
            ← Voltar para o Convite
          </a>
        </div>
      </motion.div>

      {/* Footer copyright */}
      <div className="mt-8 text-[10px] text-gray-400 font-bold tracking-widest uppercase">
        Enchanted Forest RSVP Engine © 2026
      </div>
    </div>
  );
}
