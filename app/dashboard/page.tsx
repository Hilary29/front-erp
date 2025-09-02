"use client";

import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<string>('');
  const [stats, setStats] = useState({
    presentToday: 85,
    totalEmployees: 120,
    lateArrivals: 8,
    absences: 12
  });

  useEffect(() => {
    // Récupérer le rôle utilisateur depuis localStorage
    const role = localStorage.getItem('userRole') || 'employee';
    setUserRole(role);
  }, []);

  const StatCard = ({ title, value, subtitle, color }: {
    title: string;
    value: string | number;
    subtitle: string;
    color: 'primary' | 'secondary' | 'tertiary' | 'error';
  }) => {
    const colorMap = {
      primary: 'var(--color-primary-500)',
      secondary: 'var(--color-secondary-500)',
      tertiary: 'var(--color-tertiary-500)',
      error: 'var(--color-error-500)'
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: colorMap[color] }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold" style={{ color: colorMap[color] }}>{value}</p>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b" style={{ borderBottomColor: 'var(--color-primary-200)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary-500)' }}>
                Mozart ERP
              </h1>
              <p className="text-sm text-gray-600">
                Tableau de bord {userRole === 'admin' ? 'Administrateur' : 
                              userRole === 'hr' ? 'Ressources Humaines' :
                              userRole === 'manager' ? 'Manager' : 'Employé'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="px-4 py-2 text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--color-tertiary-500)' }}
              >
                Pointer
              </button>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                   style={{ backgroundColor: 'var(--color-primary-500)' }}>
                U
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Présents aujourd'hui"
            value={`${stats.presentToday}/${stats.totalEmployees}`}
            subtitle={`${Math.round((stats.presentToday / stats.totalEmployees) * 100)}% de présence`}
            color="tertiary"
          />
          <StatCard
            title="Retards"
            value={stats.lateArrivals}
            subtitle="employés en retard"
            color="secondary"
          />
          <StatCard
            title="Absences"
            value={stats.absences}
            subtitle="non justifiées"
            color="error"
          />
          <StatCard
            title="Efficacité IA"
            value="94%"
            subtitle="prédictions correctes"
            color="primary"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Actions rapides */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-primary-500)' }}>
              Actions rapides
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                📊 Voir les rapports du jour
              </button>
              <button className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                👥 Gérer les équipes
              </button>
              <button className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                🤖 Analyses IA
              </button>
            </div>
          </div>

          {/* Notifications IA */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-secondary-600)' }}>
              🤖 Insights IA
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-md" style={{ backgroundColor: 'var(--color-tertiary-50)' }}>
                <p className="text-sm" style={{ color: 'var(--color-tertiary-800)' }}>
                  💡 Tendance détectée: 15% d'augmentation des retards le lundi
                </p>
              </div>
              <div className="p-3 rounded-md" style={{ backgroundColor: 'var(--color-secondary-50)' }}>
                <p className="text-sm" style={{ color: 'var(--color-secondary-800)' }}>
                  ⚠️ Prédiction: Pic d'absences prévu vendredi (météo)
                </p>
              </div>
              <div className="p-3 rounded-md" style={{ backgroundColor: 'var(--color-primary-50)' }}>
                <p className="text-sm" style={{ color: 'var(--color-primary-800)' }}>
                  ✨ Suggestion: Optimiser les plannings équipe Marketing
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}