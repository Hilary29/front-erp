"use client";

import { useState } from 'react';

export default function HRAttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('all');

  const employees = [
    { id: 1, name: 'Marie Dubois', department: 'IT', checkIn: '08:30', checkOut: '17:30', status: 'present', hours: '8h00' },
    { id: 2, name: 'Jean Martin', department: 'Marketing', checkIn: '08:45', checkOut: '', status: 'late', hours: '7h15' },
    { id: 3, name: 'Sophie Laurent', department: 'HR', checkIn: '', checkOut: '', status: 'absent', hours: '0h00' },
    { id: 4, name: 'Pierre Durand', department: 'Finance', checkIn: '08:15', checkOut: '17:45', status: 'present', hours: '8h30' },
    { id: 5, name: 'Emma Wilson', department: 'IT', checkIn: '09:00', checkOut: '', status: 'late', hours: '6h00' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'var(--color-tertiary-500)';
      case 'late': return 'var(--color-secondary-500)';
      case 'absent': return 'var(--color-error-500)';
      default: return 'var(--color-primary-500)';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'present': return 'var(--color-tertiary-50)';
      case 'late': return 'var(--color-secondary-50)';
      case 'absent': return 'var(--color-error-50)';
      default: return 'var(--color-primary-50)';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return 'Présent';
      case 'late': return 'Retard';
      case 'absent': return 'Absent';
      default: return 'Inconnu';
    }
  };

  const filteredEmployees = filterStatus === 'all' 
    ? employees 
    : employees.filter(emp => emp.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary-500)' }}>
                Suivi des présences
              </h1>
              <p className="text-gray-600">Gestion RH - Vue d'ensemble des pointages</p>
            </div>
            <div className="flex space-x-4">
              <button 
                className="px-4 py-2 text-white rounded-md hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--color-secondary-500)' }}
              >
                📊 Exporter
              </button>
              <button 
                className="px-4 py-2 text-white rounded-md hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--color-tertiary-500)' }}
              >
                ➕ Actions
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4" 
               style={{ borderLeftColor: 'var(--color-tertiary-500)' }}>
            <div className="text-2xl font-bold" style={{ color: 'var(--color-tertiary-500)' }}>
              {employees.filter(e => e.status === 'present').length}
            </div>
            <div className="text-sm text-gray-600">Présents</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4" 
               style={{ borderLeftColor: 'var(--color-secondary-500)' }}>
            <div className="text-2xl font-bold" style={{ color: 'var(--color-secondary-500)' }}>
              {employees.filter(e => e.status === 'late').length}
            </div>
            <div className="text-sm text-gray-600">Retards</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4" 
               style={{ borderLeftColor: 'var(--color-error-500)' }}>
            <div className="text-2xl font-bold" style={{ color: 'var(--color-error-500)' }}>
              {employees.filter(e => e.status === 'absent').length}
            </div>
            <div className="text-sm text-gray-600">Absents</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4" 
               style={{ borderLeftColor: 'var(--color-primary-500)' }}>
            <div className="text-2xl font-bold" style={{ color: 'var(--color-primary-500)' }}>
              {Math.round((employees.filter(e => e.status === 'present').length / employees.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Taux présence</div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{ focusRingColor: 'var(--color-primary-500)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
              >
                <option value="all">Tous</option>
                <option value="present">Présents</option>
                <option value="late">Retards</option>
                <option value="absent">Absents</option>
              </select>
            </div>
            <div className="flex-1"></div>
            <div>
              <button 
                className="px-4 py-2 rounded-md text-white hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primary-500)' }}
              >
                🔍 Rechercher
              </button>
            </div>
          </div>
        </div>

        {/* Table des employés */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--color-primary-500)' }}>
              Liste des employés ({filteredEmployees.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Département
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Arrivée
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sortie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Heures
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{employee.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.checkIn || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.checkOut || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {employee.hours}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: getStatusBg(employee.status),
                          color: getStatusColor(employee.status)
                        }}
                      >
                        {getStatusText(employee.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className="text-sm px-3 py-1 rounded hover:opacity-80"
                        style={{ 
                          backgroundColor: 'var(--color-tertiary-100)',
                          color: 'var(--color-tertiary-700)'
                        }}
                      >
                        Modifier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights IA */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-secondary-600)' }}>
            🤖 Analyses IA du jour
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-tertiary-50)' }}>
              <p className="text-sm" style={{ color: 'var(--color-tertiary-800)' }}>
                <strong>Tendance positive :</strong> 20% moins de retards par rapport à la semaine dernière
              </p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-secondary-50)' }}>
              <p className="text-sm" style={{ color: 'var(--color-secondary-800)' }}>
                <strong>Alert :</strong> Pic d'absences prévu demain dans le département IT (3 personnes)
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}