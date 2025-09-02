'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Button } from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import {
  ChartBarIcon,
  UsersIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface DepartmentStats {
  name: string
  totalEmployees: number
  activeEmployees: number
  avgSalary: number
  avgPerformance: number
  turnoverRate: number
  avgTenure: number
}

interface RecruitmentStats {
  month: string
  hires: number
  departures: number
  netChange: number
}

const mockDepartmentStats: DepartmentStats[] = [
  {
    name: 'Informatique',
    totalEmployees: 25,
    activeEmployees: 24,
    avgSalary: 58000,
    avgPerformance: 4.2,
    turnoverRate: 8,
    avgTenure: 3.5
  },
  {
    name: 'Design',
    totalEmployees: 12,
    activeEmployees: 12,
    avgSalary: 52000,
    avgPerformance: 4.5,
    turnoverRate: 5,
    avgTenure: 2.8
  },
  {
    name: 'Finance',
    totalEmployees: 18,
    activeEmployees: 17,
    avgSalary: 55000,
    avgPerformance: 4.0,
    turnoverRate: 12,
    avgTenure: 4.2
  },
  {
    name: 'RH',
    totalEmployees: 8,
    activeEmployees: 8,
    avgSalary: 50000,
    avgPerformance: 4.3,
    turnoverRate: 3,
    avgTenure: 5.1
  },
  {
    name: 'Ventes',
    totalEmployees: 20,
    activeEmployees: 19,
    avgSalary: 48000,
    avgPerformance: 3.8,
    turnoverRate: 18,
    avgTenure: 2.1
  }
]

const mockRecruitmentStats: RecruitmentStats[] = [
  { month: 'Jan 2024', hires: 8, departures: 3, netChange: 5 },
  { month: 'Fév 2024', hires: 12, departures: 5, netChange: 7 },
  { month: 'Mar 2024', hires: 6, departures: 8, netChange: -2 },
  { month: 'Avr 2024', hires: 10, departures: 4, netChange: 6 },
  { month: 'Mai 2024', hires: 7, departures: 6, netChange: 1 },
  { month: 'Jun 2024', hires: 9, departures: 2, netChange: 7 }
]

const attendanceData = [
  { week: 'S1', rate: 96 },
  { week: 'S2', rate: 94 },
  { week: 'S3', rate: 98 },
  { week: 'S4', rate: 95 }
]

const periodOptions = [
  { value: 'week', label: 'Cette semaine' },
  { value: 'month', label: 'Ce mois' },
  { value: 'quarter', label: 'Ce trimestre' },
  { value: 'year', label: 'Cette année' }
]

const reportOptions = [
  { value: 'overview', label: 'Vue d\'ensemble' },
  { value: 'recruitment', label: 'Recrutement' },
  { value: 'performance', label: 'Performance' },
  { value: 'attendance', label: 'Présences' },
  { value: 'payroll', label: 'Masse salariale' }
]

export default function HRReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedReport, setSelectedReport] = useState('overview')

  const handleExportReport = () => {
    alert(`Rapport ${reportOptions.find(r => r.value === selectedReport)?.label} exporté avec succès!`)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const getPerformanceBadge = (score: number) => {
    if (score >= 4.5) return <Badge variant="success">Excellent</Badge>
    if (score >= 4.0) return <Badge variant="info">Très bon</Badge>
    if (score >= 3.5) return <Badge variant="warning">Bon</Badge>
    return <Badge variant="error">À améliorer</Badge>
  }

  const getTurnoverBadge = (rate: number) => {
    if (rate <= 5) return <Badge variant="success">Faible</Badge>
    if (rate <= 10) return <Badge variant="info">Normal</Badge>
    if (rate <= 15) return <Badge variant="warning">Élevé</Badge>
    return <Badge variant="error">Critique</Badge>
  }

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
    if (current < previous) return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
    return <div className="h-4 w-4" />
  }

  const totalEmployees = mockDepartmentStats.reduce((sum, dept) => sum + dept.totalEmployees, 0)
  const totalActive = mockDepartmentStats.reduce((sum, dept) => sum + dept.activeEmployees, 0)
  const avgSalaryAll = Math.round(mockDepartmentStats.reduce((sum, dept) => sum + dept.avgSalary, 0) / mockDepartmentStats.length)
  const avgPerformanceAll = Math.round((mockDepartmentStats.reduce((sum, dept) => sum + dept.avgPerformance, 0) / mockDepartmentStats.length) * 10) / 10

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rapports RH</h1>
            <p className="text-gray-600">Analyses et statistiques des ressources humaines</p>
          </div>
          <div className="flex space-x-3">
            <Select
              value={selectedPeriod}
              onChange={(value) => setSelectedPeriod(value as string)}
              options={periodOptions}
              className="w-40"
            />
            <Select
              value={selectedReport}
              onChange={(value) => setSelectedReport(value as string)}
              options={reportOptions}
              className="w-48"
            />
            <Button onClick={handleExportReport}>
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalEmployees}</div>
                <div className="text-sm text-gray-600">Total employés</div>
              </div>
              <UsersIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {totalActive} actifs ({Math.round((totalActive / totalEmployees) * 100)}%)
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(avgSalaryAll)}</div>
                <div className="text-sm text-gray-600">Salaire moyen</div>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">€</span>
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              {getTrendIcon(avgSalaryAll, 52000)}
              <span className="ml-1">+3% vs mois précédent</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{avgPerformanceAll}</div>
                <div className="text-sm text-gray-600">Performance moy.</div>
              </div>
              <ChartBarIcon className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Sur 5 points
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">9.2%</div>
                <div className="text-sm text-gray-600">Taux rotation</div>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Moyenne annuelle
            </div>
          </div>
        </div>

        {/* Department Analysis */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Analyse par département</h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Département</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Effectif</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Salaire moyen</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Performance</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Rotation</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Ancienneté</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDepartmentStats.map((dept) => (
                    <tr key={dept.name} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-900">{dept.name}</td>
                      <td className="py-3 px-4 text-gray-700">
                        {dept.activeEmployees}/{dept.totalEmployees}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {formatCurrency(dept.avgSalary)}
                      </td>
                      <td className="py-3 px-4">
                        {getPerformanceBadge(dept.avgPerformance)}
                        <span className="ml-2 text-sm text-gray-500">
                          ({dept.avgPerformance})
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {getTurnoverBadge(dept.turnoverRate)}
                        <span className="ml-2 text-sm text-gray-500">
                          {dept.turnoverRate}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {dept.avgTenure} ans
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recruitment Trends */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution des recrutements</h3>
            <div className="space-y-4">
              {mockRecruitmentStats.slice(-4).map((month) => (
                <div key={month.month} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 text-sm font-medium text-gray-600">{month.month}</div>
                    <div className="flex space-x-2">
                      <div className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        +{month.hires}
                      </div>
                      <div className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                        -{month.departures}
                      </div>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${month.netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {month.netChange >= 0 ? '+' : ''}{month.netChange}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total embauches (6 mois):</span>
                <span className="font-medium">{mockRecruitmentStats.reduce((sum, m) => sum + m.hires, 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total départs (6 mois):</span>
                <span className="font-medium">{mockRecruitmentStats.reduce((sum, m) => sum + m.departures, 0)}</span>
              </div>
            </div>
          </div>

          {/* Attendance Trends */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Taux de présence</h3>
            <div className="space-y-4">
              {attendanceData.map((week) => (
                <div key={week.week} className="flex items-center space-x-4">
                  <div className="w-8 text-sm font-medium text-gray-600">{week.week}</div>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-4 relative">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${week.rate}%` }}
                      >
                        <span className="text-white text-xs font-medium">{week.rate}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-12">
                    <Badge variant={week.rate >= 95 ? 'success' : week.rate >= 90 ? 'warning' : 'error'}>
                      {week.rate >= 95 ? 'Bon' : week.rate >= 90 ? 'Moy' : 'Bas'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(attendanceData.reduce((sum, w) => sum + w.rate, 0) / attendanceData.length)}%
                </div>
                <div className="text-sm text-gray-500">Moyenne mensuelle</div>
              </div>
            </div>
          </div>
        </div>

        {/* Insights and Alerts */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Insights et recommandations</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-900">Performance en hausse</span>
                </div>
                <p className="text-sm text-green-700">
                  Le département Design maintient une performance excellente (4.5/5)
                </p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="font-medium text-yellow-900">Attention rotation</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Taux de rotation élevé dans les Ventes (18%). Analyse recommandée.
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-900">Planification recrutement</span>
                </div>
                <p className="text-sm text-blue-700">
                  Pic d'embauches prévu pour le Q2 basé sur les tendances actuelles.
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <ChartBarIcon className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="font-medium text-purple-900">Masse salariale</span>
                </div>
                <p className="text-sm text-purple-700">
                  Budget salaires dans les objectifs. Marge de 12% disponible.
                </p>
              </div>

              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <ClockIcon className="h-5 w-5 text-red-600 mr-2" />
                  <span className="font-medium text-red-900">Évaluations en retard</span>
                </div>
                <p className="text-sm text-red-700">
                  7 évaluations de performance en attente depuis plus de 30 jours.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <UsersIcon className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="font-medium text-gray-900">Diversité</span>
                </div>
                <p className="text-sm text-gray-700">
                  Objectifs de diversité atteints à 85%. Progression constante.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}