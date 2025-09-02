'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import Select from '@/components/ui/Select'
import {
  ChartBarIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'

interface ReportData {
  period: string
  attendance: {
    present: number
    absent: number
    late: number
    onLeave: number
  }
  productivity: {
    average: number
    trend: 'up' | 'down' | 'stable'
    change: number
  }
  overtime: {
    total: number
    average: number
  }
  projects: {
    completed: number
    inProgress: number
    delayed: number
  }
}

const mockReportData: ReportData = {
  period: 'Cette semaine',
  attendance: {
    present: 85,
    absent: 5,
    late: 8,
    onLeave: 2
  },
  productivity: {
    average: 92,
    trend: 'up',
    change: 5
  },
  overtime: {
    total: 45,
    average: 3.2
  },
  projects: {
    completed: 12,
    inProgress: 8,
    delayed: 2
  }
}

const periodOptions = [
  { value: 'week', label: 'Cette semaine' },
  { value: 'month', label: 'Ce mois' },
  { value: 'quarter', label: 'Ce trimestre' },
  { value: 'year', label: 'Cette année' }
]

const attendanceData = [
  { day: 'Lun', present: 14, absent: 1, late: 0 },
  { day: 'Mar', present: 13, absent: 0, late: 2 },
  { day: 'Mer', present: 15, absent: 0, late: 0 },
  { day: 'Jeu', present: 14, absent: 1, late: 0 },
  { day: 'Ven', present: 12, absent: 2, late: 1 }
]

const productivityData = [
  { week: 'S1', score: 88 },
  { week: 'S2', score: 91 },
  { week: 'S3', score: 89 },
  { week: 'S4', score: 94 }
]

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [reportData] = useState<ReportData>(mockReportData)

  const handleExportReport = () => {
    // Simulate report export
    alert('Rapport exporté avec succès!')
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
    if (trend === 'down') return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
    return <div className="h-4 w-4" />
  }

  const getAttendanceRate = () => {
    const total = Object.values(reportData.attendance).reduce((sum, val) => sum + val, 0)
    return Math.round((reportData.attendance.present / total) * 100)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rapports d'Équipe</h1>
            <p className="text-gray-600">Analysez les performances et la productivité de votre équipe</p>
          </div>
          <div className="flex space-x-3">
            <Select
              value={selectedPeriod}
              onChange={(value) => setSelectedPeriod(value as string)}
              options={periodOptions}
              className="w-48"
            />
            <Button onClick={handleExportReport}>
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{getAttendanceRate()}%</div>
                <div className="text-sm text-gray-600">Taux de présence</div>
              </div>
              <UserGroupIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <div className="text-2xl font-bold text-gray-900">{reportData.productivity.average}%</div>
                  {getTrendIcon(reportData.productivity.trend)}
                </div>
                <div className="text-sm text-gray-600">Productivité moy.</div>
              </div>
              <ChartBarIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {reportData.productivity.trend === 'up' ? '+' : reportData.productivity.trend === 'down' ? '-' : ''}
              {reportData.productivity.change}% vs période précédente
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{reportData.overtime.total}h</div>
                <div className="text-sm text-gray-600">Heures supplémentaires</div>
              </div>
              <ClockIcon className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Moyenne: {reportData.overtime.average}h/employé
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{reportData.projects.completed}</div>
                <div className="text-sm text-gray-600">Projets terminés</div>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">✓</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {reportData.projects.inProgress} en cours, {reportData.projects.delayed} en retard
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Présences par jour</h3>
            <div className="space-y-3">
              {attendanceData.map((day) => (
                <div key={day.day} className="flex items-center space-x-4">
                  <div className="w-8 text-sm font-medium text-gray-600">{day.day}</div>
                  <div className="flex-1 flex space-x-1">
                    <div 
                      className="bg-green-200 h-6 rounded flex items-center justify-center text-xs text-green-800"
                      style={{ width: `${(day.present / 15) * 100}%`, minWidth: '20px' }}
                    >
                      {day.present}
                    </div>
                    {day.late > 0 && (
                      <div 
                        className="bg-yellow-200 h-6 rounded flex items-center justify-center text-xs text-yellow-800"
                        style={{ width: `${(day.late / 15) * 100}%`, minWidth: '20px' }}
                      >
                        {day.late}
                      </div>
                    )}
                    {day.absent > 0 && (
                      <div 
                        className="bg-red-200 h-6 rounded flex items-center justify-center text-xs text-red-800"
                        style={{ width: `${(day.absent / 15) * 100}%`, minWidth: '20px' }}
                      >
                        {day.absent}
                      </div>
                    )}
                  </div>
                  <div className="w-12 text-sm text-gray-500">
                    {day.present + day.late + day.absent}/15
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-200 rounded"></div>
                <span className="text-xs text-gray-600">Présent</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-200 rounded"></div>
                <span className="text-xs text-gray-600">Retard</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-200 rounded"></div>
                <span className="text-xs text-gray-600">Absent</span>
              </div>
            </div>
          </div>

          {/* Productivity Trend */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution de la productivité</h3>
            <div className="space-y-3">
              {productivityData.map((week, index) => (
                <div key={week.week} className="flex items-center space-x-4">
                  <div className="w-8 text-sm font-medium text-gray-600">{week.week}</div>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-6 relative">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${week.score}%` }}
                      >
                        <span className="text-white text-xs font-medium">{week.score}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-12">
                    {index > 0 && (
                      <Badge variant={week.score > productivityData[index - 1].score ? 'success' : 'warning'}>
                        {week.score > productivityData[index - 1].score ? '↗' : '↘'}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Statistics */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Statistiques détaillées</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Répartition des présences</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Présents</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="success">{reportData.attendance.present}</Badge>
                      <span className="text-sm text-gray-500">
                        {Math.round((reportData.attendance.present / 100) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">En retard</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="warning">{reportData.attendance.late}</Badge>
                      <span className="text-sm text-gray-500">
                        {Math.round((reportData.attendance.late / 100) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Absents</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="error">{reportData.attendance.absent}</Badge>
                      <span className="text-sm text-gray-500">
                        {Math.round((reportData.attendance.absent / 100) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">En congé</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="info">{reportData.attendance.onLeave}</Badge>
                      <span className="text-sm text-gray-500">
                        {Math.round((reportData.attendance.onLeave / 100) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Gestion des projets</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Terminés</span>
                    <Badge variant="success">{reportData.projects.completed}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">En cours</span>
                    <Badge variant="info">{reportData.projects.inProgress}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">En retard</span>
                    <Badge variant="error">{reportData.projects.delayed}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Recommandations</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-900">Productivité en hausse</div>
                    <div className="text-blue-700">L'équipe performe bien ce mois</div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="font-medium text-yellow-900">Attention aux retards</div>
                    <div className="text-yellow-700">8% de retards cette semaine</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}