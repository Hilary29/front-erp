"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implémenter l'authentification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock login - à remplacer par vraie authentification
    localStorage.setItem('userRole', 'admin');
    router.push('/dashboard');
    
    setIsLoading(false);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ background: 'linear-gradient(135deg, var(--color-primary-100) 0%, var(--color-tertiary-50) 100%)' }}
    >
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 
            className="mt-6 text-center text-3xl font-extrabold"
            style={{ color: 'var(--color-primary-500)' }}
          >
            Mozart ERP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Système de gestion des présences avec IA
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email professionnel
              </label>
              <input
                id="email"
                type="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ 
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-primary-500)';
                  e.target.style.boxShadow = '0 0 0 2px var(--color-primary-200)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ 
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-primary-500)';
                  e.target.style.boxShadow = '0 0 0 2px var(--color-primary-200)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <a
              href="/forgot-password"
              className="text-sm hover:underline"
              style={{ color: 'var(--color-secondary-600)' }}
            >
              Mot de passe oublié ?
            </a>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-semibold rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              style={{ 
                backgroundColor: 'var(--color-primary-500)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary-600)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary-500)';
              }}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Vous n'avez pas de compte ?{' '}
              <a
                href="/register"
                className="font-medium hover:underline"
                style={{ color: 'var(--color-secondary-600)' }}
              >
                S'inscrire
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}