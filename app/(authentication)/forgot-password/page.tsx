"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implémenter l'envoi d'email de reset
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsEmailSent(true);
    setIsLoading(false);
  };

  if (isEmailSent) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(135deg, var(--color-tertiary-50) 0%, var(--color-primary-50) 100%)' }}
      >
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div 
              className="mx-auto h-20 w-20 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: 'var(--color-tertiary-100)' }}
            >
              <span className="text-3xl">📧</span>
            </div>
            <h2 
              className="text-2xl font-bold"
              style={{ color: 'var(--color-primary-500)' }}
            >
              Email envoyé !
            </h2>
            <p className="mt-4 text-gray-600">
              Un lien de réinitialisation a été envoyé à <strong>{email}</strong>
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Vérifiez votre boîte de réception et suivez les instructions pour créer un nouveau mot de passe.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push('/login')}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-all duration-200"
              style={{ backgroundColor: 'var(--color-primary-500)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary-600)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary-500)';
              }}
            >
              Retour à la connexion
            </button>

            <button
              onClick={() => {
                setIsEmailSent(false);
                setEmail('');
              }}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Renvoyer l'email
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Si vous ne recevez pas d'email dans les 5 minutes, vérifiez vos spams ou contactez l'administrateur.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ background: 'linear-gradient(135deg, var(--color-tertiary-50) 0%, var(--color-primary-50) 100%)' }}
    >
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 
            className="mt-6 text-center text-3xl font-extrabold"
            style={{ color: 'var(--color-primary-500)' }}
          >
            Mot de passe oublié
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Saisissez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              required
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ outline: 'none' }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-primary-500)';
                e.target.style.boxShadow = '0 0 0 2px var(--color-primary-200)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !email}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              style={{ backgroundColor: 'var(--color-primary-500)' }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-600)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-500)';
                }
              }}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Envoi en cours...
                </div>
              ) : (
                'Envoyer le lien de réinitialisation'
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <a
              href="/login"
              className="text-sm hover:underline"
              style={{ color: 'var(--color-primary-600)' }}
            >
              ← Retour à la connexion
            </a>
            <a
              href="/register"
              className="text-sm hover:underline"
              style={{ color: 'var(--color-secondary-600)' }}
            >
              Créer un compte →
            </a>
          </div>
        </form>

        <div 
          className="rounded-lg p-4 border-l-4"
          style={{ 
            backgroundColor: 'var(--color-secondary-50)', 
            borderLeftColor: 'var(--color-secondary-500)' 
          }}
        >
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm" style={{ color: 'var(--color-secondary-800)' }}>
                <strong>💡 Astuce :</strong> Utilisez votre adresse email professionnelle pour retrouver votre compte plus facilement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}