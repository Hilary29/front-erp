'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import Table from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import Select from '@/components/ui/Select'
import {
  PlusIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

interface TimesheetEntry {
  id: string
  date: string
  startTime: string
  endTime: string
  breakDuration: number
  totalHours: number
  project: string
  task: string
  description: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  comments?: string
}

const mockTimesheet: TimesheetEntry[] = [
  {
    id: '1',
    date: '2024-01-15',
    startTime: '09:00',
    endTime: '17:00',
    breakDuration: 60,
    totalHours: 7,
    project: 'ERP Mozart',
    task: 'Développement Frontend',
    description: 'Implémentation des interfaces utilisateur',
    status: 'approved'
  },
  {
    id: '2',
    date: '2024-01-16',
    startTime: '09:15',
    endTime: '17:30',
    breakDuration: 60,
    totalHours: 7.25,
    project: 'ERP Mozart',
    task: 'Tests unitaires',
    description: 'Écriture des tests pour les composants',
    status: 'submitted'
  },
  {
    id: '3',
    date: '2024-01-17',
    startTime: '09:00',
    endTime: '18:00',
    breakDuration: 60,
    totalHours: 8,
    project: 'Site Web Corporate',
    task: 'Intégration',
    description: 'Intégration des maquettes design',
    status: 'draft'
  }
]

const projectOptions = [
  { value: 'ERP Mozart', label: 'ERP Mozart' },
  { value: 'Site Web Corporate', label: 'Site Web Corporate' },
  { value: 'Application Mobile', label: 'Application Mobile' },
  { value: 'Formation', label: 'Formation' },
  { value: 'Maintenance', label: 'Maintenance' }
]

const taskOptions = [
  { value: 'Développement Frontend', label: 'Développement Frontend' },
  { value: 'Développement Backend', label: 'Développement Backend' },
  { value: 'Tests unitaires', label: 'Tests unitaires' },
  { value: 'Intégration', label: 'Intégration' },
  { value: 'Documentation', label: 'Documentation' },
  { value: 'Réunion', label: 'Réunion' },
  { value: 'Formation', label: 'Formation' }
]

export default function TimesheetPage() {
  const [timesheet, setTimesheet] = useState<TimesheetEntry[]>(mockTimesheet)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<TimesheetEntry | null>(null)
  const [sortColumn, setSortColumn] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    breakDuration: '60',
    project: '',
    task: '',
    description: ''
  })

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const calculateTotalHours = (start: string, end: string, breakMinutes: number) => {
    if (!start || !end) return 0
    const startTime = new Date(`2000-01-01T${start}`)
    const endTime = new Date(`2000-01-01T${end}`)
    const totalMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60)
    return Math.round(((totalMinutes - breakMinutes) / 60) * 100) / 100
  }

  const handleAddEntry = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '17:00',
      breakDuration: '60',
      project: '',
      task: '',
      description: ''
    })
    setIsAddModalOpen(true)
  }

  const handleEditEntry = (entry: TimesheetEntry) => {
    if (entry.status !== 'draft') {
      alert('Seules les entrées en brouillon peuvent être modifiées')
      return
    }
    
    setSelectedEntry(entry)
    setFormData({
      date: entry.date,
      startTime: entry.startTime,
      endTime: entry.endTime,
      breakDuration: entry.breakDuration.toString(),
      project: entry.project,
      task: entry.task,
      description: entry.description
    })
    setIsEditModalOpen(true)
  }

  const handleDeleteEntry = (entryId: string) => {
    const entry = timesheet.find(e => e.id === entryId)
    if (entry && entry.status !== 'draft') {
      alert('Seules les entrées en brouillon peuvent être supprimées')
      return
    }
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) {
      setTimesheet(timesheet.filter(entry => entry.id !== entryId))
    }
  }

  const handleSubmitEntry = (entryId: string) => {
    setTimesheet(timesheet.map(entry => 
      entry.id === entryId 
        ? { ...entry, status: 'submitted' as const }
        : entry
    ))
  }

  const handleSubmit = (isEdit: boolean) => {
    const totalHours = calculateTotalHours(
      formData.startTime,
      formData.endTime,
      parseInt(formData.breakDuration)
    )

    if (isEdit && selectedEntry) {
      setTimesheet(timesheet.map(entry => 
        entry.id === selectedEntry.id 
          ? {
              ...entry,
              date: formData.date,
              startTime: formData.startTime,
              endTime: formData.endTime,
              breakDuration: parseInt(formData.breakDuration),
              totalHours,
              project: formData.project,
              task: formData.task,
              description: formData.description
            }
          : entry
      ))
      setIsEditModalOpen(false)
    } else {
      const newEntry: TimesheetEntry = {
        id: Date.now().toString(),
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        breakDuration: parseInt(formData.breakDuration),
        totalHours,
        project: formData.project,
        task: formData.task,
        description: formData.description,
        status: 'draft'
      }
      setTimesheet([...timesheet, newEntry])
      setIsAddModalOpen(false)
    }
  }

  const handleExport = () => {
    alert('Feuilles de temps exportées avec succès!')
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'default',
      submitted: 'warning',
      approved: 'success',
      rejected: 'error'
    } as const
    
    const labels = {
      draft: 'Brouillon',
      submitted: 'Soumis',
      approved: 'Approuvé',
      rejected: 'Rejeté'
    }

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  const columns = [
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (entry: TimesheetEntry) => (
        new Date(entry.date).toLocaleDateString('fr-FR', {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit'
        })
      )
    },
    {
      key: 'time',
      label: 'Horaires',
      render: (entry: TimesheetEntry) => (
        <div className="flex items-center">
          <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
          {entry.startTime} - {entry.endTime}
        </div>
      )
    },
    {
      key: 'totalHours',
      label: 'Heures',
      sortable: true,
      render: (entry: TimesheetEntry) => (
        <span className="font-medium">{entry.totalHours}h</span>
      )
    },
    {
      key: 'project',
      label: 'Projet',
      sortable: true
    },
    {
      key: 'task',
      label: 'Tâche',
      sortable: true
    },
    {
      key: 'status',
      label: 'Statut',
      sortable: true,
      render: (entry: TimesheetEntry) => getStatusBadge(entry.status)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (entry: TimesheetEntry) => (
        <div className="flex space-x-2">
          {entry.status === 'draft' && (
            <>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleEditEntry(entry)}
                title="Modifier"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleSubmitEntry(entry.id)}
                title="Soumettre"
              >
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleDeleteEntry(entry.id)}
                title="Supprimer"
              >
                <TrashIcon className="h-4 w-4 text-red-600" />
              </Button>
            </>
          )}
          {entry.status === 'rejected' && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleEditEntry(entry)}
              title="Corriger"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      )
    }
  ]

  const totalHours = timesheet.reduce((sum, entry) => sum + entry.totalHours, 0)
  const approvedHours = timesheet.filter(e => e.status === 'approved').reduce((sum, entry) => sum + entry.totalHours, 0)
  const pendingHours = timesheet.filter(e => e.status === 'submitted').reduce((sum, entry) => sum + entry.totalHours, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes Feuilles de Temps</h1>
            <p className="text-gray-600">Gérez vos heures de travail et soumettez vos feuilles de temps</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExport}>
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button onClick={handleAddEntry}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Nouvelle entrée
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">{totalHours}h</div>
            <div className="text-sm text-gray-600">Total heures</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{approvedHours}h</div>
            <div className="text-sm text-gray-600">Heures approuvées</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">{pendingHours}h</div>
            <div className="text-sm text-gray-600">En attente</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">
              {timesheet.filter(e => e.status === 'draft').length}
            </div>
            <div className="text-sm text-gray-600">Brouillons</div>
          </div>
        </div>

        {/* Timesheet Table */}
        <Table
          data={timesheet}
          columns={columns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        {/* Add Entry Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Nouvelle entrée"
          maxWidth="lg"
        >
          <div className="space-y-4">
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
            <div className="grid grid-cols-3 gap-4">
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
              <Input
                label="Pause (min)"
                type="number"
                value={formData.breakDuration}
                onChange={(e) => setFormData({...formData, breakDuration: e.target.value})}
                required
              />
            </div>
            {formData.startTime && formData.endTime && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-sm text-gray-600">Total: </span>
                <span className="font-medium">
                  {calculateTotalHours(formData.startTime, formData.endTime, parseInt(formData.breakDuration) || 0)}h
                </span>
              </div>
            )}
            <Select
              label="Projet"
              value={formData.project}
              onChange={(value) => setFormData({...formData, project: value as string})}
              options={projectOptions}
            />
            <Select
              label="Tâche"
              value={formData.task}
              onChange={(value) => setFormData({...formData, task: value as string})}
              options={taskOptions}
            />
            <Input
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
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

        {/* Edit Entry Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Modifier l'entrée"
          maxWidth="lg"
        >
          <div className="space-y-4">
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
            <div className="grid grid-cols-3 gap-4">
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
              <Input
                label="Pause (min)"
                type="number"
                value={formData.breakDuration}
                onChange={(e) => setFormData({...formData, breakDuration: e.target.value})}
                required
              />
            </div>
            {formData.startTime && formData.endTime && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-sm text-gray-600">Total: </span>
                <span className="font-medium">
                  {calculateTotalHours(formData.startTime, formData.endTime, parseInt(formData.breakDuration) || 0)}h
                </span>
              </div>
            )}
            <Select
              label="Projet"
              value={formData.project}
              onChange={(value) => setFormData({...formData, project: value as string})}
              options={projectOptions}
            />
            <Select
              label="Tâche"
              value={formData.task}
              onChange={(value) => setFormData({...formData, task: value as string})}
              options={taskOptions}
            />
            <Input
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
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