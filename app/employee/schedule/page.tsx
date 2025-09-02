'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Badge } from '@/components/ui/Badge'
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

interface ScheduleEntry {
  id: string
  date: string
  startTime: string
  endTime: string
  shift: 'morning' | 'afternoon' | 'night'
  location: string
  team: string
  manager: string
  status: 'scheduled' | 'confirmed' | 'completed'
  notes?: string
}

const mockSchedule: ScheduleEntry[] = [
  {
    id: '1',
    date: '2024-01-15',
    startTime: '09:00',
    endTime: '17:00',
    shift: 'morning',
    location: 'Bureau Principal',
    team: 'Développement',
    manager: 'Jean Dupont',
    status: 'confirmed',
    notes: 'Réunion équipe à 14h'
  },
  {
    id: '2',
    date: '2024-01-16',
    startTime: '09:00',
    endTime: '17:00',
    shift: 'morning',
    location: 'Bureau Principal',
    team: 'Développement',
    manager: 'Jean Dupont',
    status: 'scheduled'
  },
  {
    id: '3',
    date: '2024-01-17',
    startTime: '09:00',
    endTime: '17:00',
    shift: 'morning',
    location: 'Télétravail',
    team: 'Développement',
    manager: 'Jean Dupont',
    status: 'scheduled',
    notes: 'Journée télétravail'
  },
  {
    id: '4',
    date: '2024-01-18',
    startTime: '09:00',
    endTime: '17:00',
    shift: 'morning',
    location: 'Bureau Principal',
    team: 'Développement',
    manager: 'Jean Dupont',
    status: 'scheduled'
  },
  {
    id: '5',
    date: '2024-01-19',
    startTime: '09:00',
    endTime: '17:00',
    shift: 'morning',
    location: 'Bureau Principal',
    team: 'Développement',
    manager: 'Jean Dupont',
    status: 'scheduled'
  }
]

export default function EmployeeSchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [schedule] = useState<ScheduleEntry[]>(mockSchedule)

  const getCurrentWeekDates = () => {
    const start = new Date(selectedDate)
    const day = start.getDay()
    const diff = start.getDate() - day + (day === 0 ? -6 : 1)
    start.setDate(diff)
    
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const getScheduleForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return schedule.find(entry => entry.date === dateStr)
  }

  const handlePreviousWeek = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() - 7)
    setSelectedDate(newDate)
  }

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() + 7)
    setSelectedDate(newDate)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: 'warning',
      confirmed: 'success',
      completed: 'info'
    } as const
    
    const labels = {
      scheduled: 'Programmé',
      confirmed: 'Confirmé',
      completed: 'Terminé'
    }

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  const getShiftLabel = (shift: string) => {
    const labels = {
      morning: 'Matin',
      afternoon: 'Après-midi',
      night: 'Nuit'
    }
    return labels[shift as keyof typeof labels] || shift
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const weekDates = getCurrentWeekDates()
  const totalHours = schedule.reduce((sum, entry) => {
    const start = new Date(`2000-01-01T${entry.startTime}`)
    const end = new Date(`2000-01-01T${entry.endTime}`)
    return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
  }, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Planning</h1>
          <p className="text-gray-600">Consultez votre planning de travail et vos horaires</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">{schedule.length}</div>
            <div className="text-sm text-gray-600">Jours programmés</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{totalHours}h</div>
            <div className="text-sm text-gray-600">Heures prévues</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {schedule.filter(s => s.status === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-600">Jours confirmés</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">
              {schedule.filter(s => s.location === 'Télétravail').length}
            </div>
            <div className="text-sm text-gray-600">Jours télétravail</div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Semaine du {formatDate(weekDates[0])}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handlePreviousWeek}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNextWeek}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {weekDates.map((date, index) => {
                const daySchedule = getScheduleForDate(date)
                const isToday = date.toDateString() === new Date().toDateString()
                const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' })
                
                return (
                  <div key={index} className={`border rounded-lg p-4 ${isToday ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                    <div className={`text-center pb-3 mb-3 border-b ${isToday ? 'border-primary-200' : 'border-gray-200'}`}>
                      <div className="text-sm font-medium text-gray-600 uppercase">
                        {dayName}
                      </div>
                      <div className={`text-xl font-bold mt-1 ${isToday ? 'text-primary-600' : 'text-gray-900'}`}>
                        {date.getDate()}
                      </div>
                    </div>
                    
                    {daySchedule ? (
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium">
                            {daySchedule.startTime} - {daySchedule.endTime}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm">
                          <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">{daySchedule.location}</span>
                        </div>
                        
                        <div className="flex items-center text-sm">
                          <UserGroupIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">{daySchedule.team}</span>
                        </div>
                        
                        <div className="mt-2">
                          {getStatusBadge(daySchedule.status)}
                        </div>
                        
                        {daySchedule.notes && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                            {daySchedule.notes}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-400 text-sm">Jour libre</div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Prochains créneaux</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {schedule.slice(0, 5).map((entry) => {
                const entryDate = new Date(entry.date)
                const isToday = entryDate.toDateString() === new Date().toDateString()
                
                return (
                  <div key={entry.id} className={`flex items-center justify-between p-4 rounded-lg border ${isToday ? 'border-primary-200 bg-primary-50' : 'border-gray-200'}`}>
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isToday ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        <CalendarIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {entryDate.toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long' 
                          })}
                        </div>
                        <div className="text-sm text-gray-500">
                          {entry.startTime} - {entry.endTime} • {entry.location}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getShiftLabel(entry.shift)} • Équipe {entry.team}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(entry.status)}
                      <div className="text-sm text-gray-500 mt-1">
                        Manager: {entry.manager}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}