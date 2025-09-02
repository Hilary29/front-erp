'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Button } from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import {
  PlusIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

interface ScheduleEntry {
  id: string
  employeeId: string
  employeeName: string
  date: string
  startTime: string
  endTime: string
  shift: 'morning' | 'afternoon' | 'night'
  status: 'scheduled' | 'confirmed' | 'absent'
  notes?: string
}

interface Employee {
  id: string
  name: string
  position: string
}

const mockEmployees: Employee[] = [
  { id: '1', name: 'Alice Johnson', position: 'Développeur Senior' },
  { id: '2', name: 'Bob Smith', position: 'Développeur Junior' },
  { id: '3', name: 'Carol Brown', position: 'Designer UX/UI' },
  { id: '4', name: 'David Wilson', position: 'Analyste' }
]

const mockSchedule: ScheduleEntry[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Alice Johnson',
    date: '2024-01-15',
    startTime: '09:00',
    endTime: '17:00',
    shift: 'morning',
    status: 'confirmed'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Bob Smith',
    date: '2024-01-15',
    startTime: '10:00',
    endTime: '18:00',
    shift: 'morning',
    status: 'scheduled'
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Carol Brown',
    date: '2024-01-16',
    startTime: '14:00',
    endTime: '22:00',
    shift: 'afternoon',
    status: 'confirmed'
  }
]

const shiftOptions = [
  { value: 'morning', label: 'Matin (9h-17h)' },
  { value: 'afternoon', label: 'Après-midi (14h-22h)' },
  { value: 'night', label: 'Nuit (22h-6h)' }
]

const statusOptions = [
  { value: 'scheduled', label: 'Programmé' },
  { value: 'confirmed', label: 'Confirmé' },
  { value: 'absent', label: 'Absent' }
]

export default function SchedulingPage() {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>(mockSchedule)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<ScheduleEntry | null>(null)
  
  const [formData, setFormData] = useState({
    employeeId: '',
    date: '',
    startTime: '',
    endTime: '',
    shift: 'morning',
    status: 'scheduled',
    notes: ''
  })

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

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
    return schedule.filter(entry => entry.date === dateStr)
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

  const handleAddSchedule = () => {
    setFormData({
      employeeId: '',
      date: '',
      startTime: '',
      endTime: '',
      shift: 'morning',
      status: 'scheduled',
      notes: ''
    })
    setIsAddModalOpen(true)
  }

  const handleEditSchedule = (entry: ScheduleEntry) => {
    setSelectedEntry(entry)
    setFormData({
      employeeId: entry.employeeId,
      date: entry.date,
      startTime: entry.startTime,
      endTime: entry.endTime,
      shift: entry.shift,
      status: entry.status,
      notes: entry.notes || ''
    })
    setIsEditModalOpen(true)
  }

  const handleDeleteSchedule = (entryId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette programmation ?')) {
      setSchedule(schedule.filter(entry => entry.id !== entryId))
    }
  }

  const handleSubmit = (isEdit: boolean) => {
    const employee = mockEmployees.find(emp => emp.id === formData.employeeId)
    if (!employee) return

    if (isEdit && selectedEntry) {
      setSchedule(schedule.map(entry => 
        entry.id === selectedEntry.id 
          ? {
              ...entry,
              ...formData,
              shift: formData.shift as 'morning' | 'afternoon' | 'night',
              status: formData.status as 'scheduled' | 'confirmed' | 'absent',
              employeeName: employee.name
            }
          : entry
      ))
      setIsEditModalOpen(false)
    } else {
      const newEntry: ScheduleEntry = {
        id: Date.now().toString(),
        employeeId: formData.employeeId,
        employeeName: employee.name,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        shift: formData.shift as 'morning' | 'afternoon' | 'night',
        status: formData.status as 'scheduled' | 'confirmed' | 'absent',
        notes: formData.notes
      }
      setSchedule([...schedule, newEntry])
      setIsAddModalOpen(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: 'warning',
      confirmed: 'success',
      absent: 'error'
    } as const
    
    const labels = {
      scheduled: 'Programmé',
      confirmed: 'Confirmé',
      absent: 'Absent'
    }

    return (
      <Badge variant={variants[status as keyof typeof variants]} size="sm">
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  const getShiftColor = (shift: string) => {
    const colors = {
      morning: 'bg-blue-100 text-blue-800',
      afternoon: 'bg-orange-100 text-orange-800',
      night: 'bg-purple-100 text-purple-800'
    }
    return colors[shift as keyof typeof colors] || colors.morning
  }

  const weekDates = getCurrentWeekDates()
  const totalScheduled = schedule.length
  const totalConfirmed = schedule.filter(s => s.status === 'confirmed').length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Planification</h1>
            <p className="text-gray-600">Gérez les horaires et les équipes de travail</p>
          </div>
          <Button onClick={handleAddSchedule}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Nouveau créneau
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">{totalScheduled}</div>
            <div className="text-sm text-gray-600">Créneaux programmés</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{totalConfirmed}</div>
            <div className="text-sm text-gray-600">Créneaux confirmés</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{mockEmployees.length}</div>
            <div className="text-sm text-gray-600">Employés disponibles</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((totalConfirmed / totalScheduled) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Taux de confirmation</div>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Semaine du {formatDate(weekDates[0])}
              </h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleNextWeek}>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Week Calendar */}
          <div className="p-4">
            <div className="grid grid-cols-7 gap-4">
              {weekDates.map((date, index) => {
                const daySchedule = getScheduleForDate(date)
                const isToday = date.toDateString() === new Date().toDateString()
                
                return (
                  <div key={index} className="border rounded-lg p-3 min-h-[200px]">
                    <div className={`text-center pb-2 mb-2 border-b ${isToday ? 'font-bold text-primary-600' : 'text-gray-600'}`}>
                      <div className="text-sm">
                        {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                      </div>
                      <div className={`text-lg ${isToday ? 'bg-primary-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto' : ''}`}>
                        {date.getDate()}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {daySchedule.map((entry) => (
                        <div key={entry.id} className={`text-xs p-2 rounded border-l-2 ${getShiftColor(entry.shift)} border-l-current`}>
                          <div className="font-medium truncate">{entry.employeeName}</div>
                          <div className="flex items-center space-x-1 mt-1">
                            <ClockIcon className="h-3 w-3" />
                            <span>{entry.startTime}-{entry.endTime}</span>
                          </div>
                          <div className="mt-1">
                            {getStatusBadge(entry.status)}
                          </div>
                          <div className="flex justify-end space-x-1 mt-1">
                            <button
                              onClick={() => handleEditSchedule(entry)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <PencilIcon className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteSchedule(entry.id)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <TrashIcon className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {daySchedule.length === 0 && (
                        <div className="text-gray-400 text-xs text-center py-4">
                          Aucune programmation
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Add Schedule Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Nouveau créneau"
          maxWidth="lg"
        >
          <div className="space-y-4">
            <Select
              label="Employé"
              value={formData.employeeId}
              onChange={(value) => setFormData({...formData, employeeId: value as string})}
              options={mockEmployees.map(emp => ({
                value: emp.id,
                label: `${emp.name} - ${emp.position}`
              }))}
            />
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Heure de début"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                required
              />
              <Input
                label="Heure de fin"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                required
              />
            </div>
            <Select
              label="Équipe"
              value={formData.shift}
              onChange={(value) => setFormData({...formData, shift: value as string})}
              options={shiftOptions}
            />
            <Select
              label="Statut"
              value={formData.status}
              onChange={(value) => setFormData({...formData, status: value as string})}
              options={statusOptions}
            />
            <Input
              label="Notes (optionnel)"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => handleSubmit(false)}>
                Ajouter
              </Button>
            </div>
          </div>
        </Modal>

        {/* Edit Schedule Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Modifier le créneau"
          maxWidth="lg"
        >
          <div className="space-y-4">
            <Select
              label="Employé"
              value={formData.employeeId}
              onChange={(value) => setFormData({...formData, employeeId: value as string})}
              options={mockEmployees.map(emp => ({
                value: emp.id,
                label: `${emp.name} - ${emp.position}`
              }))}
            />
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Heure de début"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                required
              />
              <Input
                label="Heure de fin"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                required
              />
            </div>
            <Select
              label="Équipe"
              value={formData.shift}
              onChange={(value) => setFormData({...formData, shift: value as string})}
              options={shiftOptions}
            />
            <Select
              label="Statut"
              value={formData.status}
              onChange={(value) => setFormData({...formData, status: value as string})}
              options={statusOptions}
            />
            <Input
              label="Notes (optionnel)"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => handleSubmit(true)}>
                Sauvegarder
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}