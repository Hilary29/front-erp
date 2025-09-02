"use client";

import { useState } from 'react';

export default function EmployeeDashboard() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string>('');

  const handleCheckIn = () => {
    const now = new Date();
    setIsCheckedIn(true);
    setCheckInTime(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    setCheckInTime('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary-500)' }}>
            Tableau de bord employé
          </h1>
          <p className="text-gray-600">Bienvenue, gérez vos présences facilement</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pointage rapide */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-primary-500)' }}>
            ⏰ Pointage rapide
          </h2>
          
          <div className="flex items-center justify-center space-x-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: 'var(--color-primary-500)' }}>
                {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            
            <div className="text-center">
              {!isCheckedIn ? (
                <button
                  onClick={handleCheckIn}
                  className="px-8 py-4 rounded-full text-white font-semibold text-lg hover:opacity-90 transition-all transform hover:scale-105"
                  style={{ backgroundColor: 'var(--color-tertiary-500)' }}
                >
                  ✅ Pointer l'arrivée
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Pointé à {checkInTime}</div>
                    <div 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                      style={{ 
                        backgroundColor: 'var(--color-tertiary-100)', 
                        color: 'var(--color-tertiary-800)' 
                      }}
                    >
                      ✓ Présent
                    </div>
                  </div>
                  <button
                    onClick={handleCheckOut}
                    className="px-8 py-4 rounded-full text-white font-semibold text-lg hover:opacity-90 transition-all transform hover:scale-105"
                    style={{ backgroundColor: 'var(--color-secondary-500)' }}
                  >
                    🚪 Pointer la sortie
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Planning du jour */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-primary-500)' }}>
              📅 Planning du jour
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span>Horaire prévu</span>
                <span className="font-medium">08h30 - 17h30</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span>Pause déjeuner</span>
                <span className="font-medium">12h00 - 13h00</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded"
                   style={{ backgroundColor: 'var(--color-tertiary-50)' }}>
                <span>Temps travaillé aujourd'hui</span>
                <span className="font-medium" style={{ color: 'var(--color-tertiary-700)' }}>
                  {isCheckedIn ? '3h45' : '0h00'}
                </span>
              </div>
            </div>
          </div>

          {/* Résumé de la semaine */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-secondary-600)' }}>
              📊 Résumé hebdomadaire
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Heures travaillées</span>
                <span className="font-medium">32h15 / 35h</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ 
                    backgroundColor: 'var(--color-secondary-500)', 
                    width: '92%' 
                  }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 rounded" style={{ backgroundColor: 'var(--color-tertiary-50)' }}>
                  <div className="text-2xl font-bold" style={{ color: 'var(--color-tertiary-600)' }}>4</div>
                  <div className="text-sm text-gray-600">Jours présents</div>
                </div>
                <div className="text-center p-3 rounded" style={{ backgroundColor: 'var(--color-primary-50)' }}>
                  <div className="text-2xl font-bold" style={{ color: 'var(--color-primary-600)' }}>0</div>
                  <div className="text-sm text-gray-600">Retards</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-primary-500)' }}>
            ⚡ Actions rapides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="p-4 text-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="text-2xl mb-2">🗓️</div>
              <div className="text-sm font-medium">Voir planning</div>
            </button>
            <button className="p-4 text-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="text-2xl mb-2">📝</div>
              <div className="text-sm font-medium">Demander congé</div>
            </button>
            <button className="p-4 text-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="text-2xl mb-2">📈</div>
              <div className="text-sm font-medium">Mes statistiques</div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}