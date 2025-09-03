"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validation côté client
    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          department: formData.department
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Compte créé avec succès! Vous êtes maintenant connecté.');
        // Stocker les infos utilisateur dans localStorage pour compatibilité
        localStorage.setItem('userRole', result.data.role);
        localStorage.setItem('userName', `${result.data.firstName} ${result.data.lastName}`);
        localStorage.setItem('userEmail', result.data.email);
        
        router.push('/dashboard');
      } else {
        alert(result.error || 'Erreur lors de la création du compte');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Erreur de création de compte. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
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
            Créer un nouveau compte employé
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  Prénom
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ outline: 'none' }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-primary-500)';
                    e.target.style.boxShadow = '0 0 0 2px var(--color-primary-200)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Prénom"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ outline: 'none' }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-primary-500)';
                    e.target.style.boxShadow = '0 0 0 2px var(--color-primary-200)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Nom"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email professionnel
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ outline: 'none' }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-primary-500)';
                  e.target.style.boxShadow = '0 0 0 2px var(--color-primary-200)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Département
              </label>
              <select
                id="department"
                name="department"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ outline: 'none' }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-primary-500)';
                  e.target.style.boxShadow = '0 0 0 2px var(--color-primary-200)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
                value={formData.department}
                onChange={handleInputChange}
              >
                <option value="">Sélectionner un département</option>
                <option value="it">Informatique</option>
                <option value="hr">Ressources Humaines</option>
                <option value="finance">Finance</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Commercial</option>
                <option value="operations">Opérations</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ outline: 'none' }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-primary-500)';
                  e.target.style.boxShadow = '0 0 0 2px var(--color-primary-200)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ outline: 'none' }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-primary-500)';
                  e.target.style.boxShadow = '0 0 0 2px var(--color-primary-200)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-semibold rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              style={{ backgroundColor: 'var(--color-primary-500)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary-600)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary-500)';
              }}
            >
              {isLoading ? 'Création du compte...' : 'Créer mon compte'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{' '}
              <a
                href="/login"
                className="font-medium hover:underline"
                style={{ color: 'var(--color-secondary-600)' }}
              >
                Se connecter
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}