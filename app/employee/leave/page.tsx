'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import Table from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import {
  PlusIcon,
  CalendarIcon,
  EyeIcon,
  XMarkIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface LeaveRequest {
  id: string
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'unpaid'
  startDate: string
  endDate: string
  days: number
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  submittedDate: string
  approvedBy?: string
  comments?: string
}

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    type: 'vacation',
    startDate: '2024-02-15',
    endDate: '2024-02-25',
    days: 10,
    reason: 'Vacances familiales',
    status: 'approved',
    submittedDate: '2024-01-10',
    approvedBy: 'Jean Dupont',
    comments: 'Demande approuvée. Bonnes vacances!'
  },
  {
    id: '2',
    type: 'sick',
    startDate: '2024-01-20',
    endDate: '2024-01-22',
    days: 2,
    reason: 'Grippe',
    status: 'approved',
    submittedDate: '2024-01-20',
    approvedBy: 'Jean Dupont'
  },
  {
    id: '3',
    type: 'personal',
    startDate: '2024-03-10',
    endDate: '2024-03-10',
    days: 1,
    reason: 'Rendez-vous médical',
    status: 'pending',
    submittedDate: '2024-01-15'
  },
  {
    id: '4',
    type: 'vacation',
    startDate: '2024-04-01',
    endDate: '2024-04-05',
    days: 5,
    reason: 'Vacances de printemps',
    status: 'rejected',
    submittedDate: '2024-01-12',
    comments: 'Période trop chargée, merci de choisir une autre période.'
  }
]

const leaveTypeOptions = [
  { value: 'vacation', label: 'Congés payés' },
  { value: 'sick', label: 'Congé maladie' },
  { value: 'personal', label: 'Congé personnel' },
  { value: 'maternity', label: 'Congé maternité' },
  { value: 'unpaid', label: 'Congé sans solde' }
]

export default function LeavePage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const [sortColumn, setSortColumn] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  
  const [formData, setFormData] = useState({
    type: 'vacation',
    startDate: '',
    endDate: '',
    reason: ''
  })

  // Mock leave balance
  const leaveBalance = {
    vacation: { total: 25, used: 12, remaining: 13 },
    sick: { total: 10, used: 2, remaining: 8 },
    personal: { total: 5, used: 1, remaining: 4 }
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const calculateDays = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const handleAddRequest = () => {
    setFormData({
      type: 'vacation',
      startDate: '',
      endDate: '',
      reason: ''
    })
    setIsAddModalOpen(true)
  }

  const handleViewDetails = (request: LeaveRequest) => {
    setSelectedRequest(request)
    setIsDetailModalOpen(true)
  }

  const handleCancelRequest = (requestId: string) => {
    if (confirm('Êtes-vous sûr de vouloir annuler cette demande ?')) {
      setLeaveRequests(leaveRequests.map(request => 
        request.id === requestId 
          ? { ...request, status: 'cancelled' as const }
          : request
      ))
    }
  }

  const handleSubmit = () => {
    const days = calculateDays(formData.startDate, formData.endDate)
    const newRequest: LeaveRequest = {
      id: Date.now().toString(),
      type: formData.type as LeaveRequest['type'],
      startDate: formData.startDate,
      endDate: formData.endDate,
      days,
      reason: formData.reason,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0]
    }
    setLeaveRequests([...leaveRequests, newRequest])
    setIsAddModalOpen(false)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'warning',
      approved: 'success',
      rejected: 'error',
      cancelled: 'default'
    } as const
    
    const labels = {
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Rejeté',
      cancelled: 'Annulé'
    }

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  const getLeaveTypeLabel = (type: string) => {
    const labels = {
      vacation: 'Congés payés',
      sick: 'Congé maladie',
      personal: 'Congé personnel',
      maternity: 'Congé maternité',
      unpaid: 'Congé sans solde'
    }
    return labels[type as keyof typeof labels] || type
  }

  const columns = [
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (request: LeaveRequest) => getLeaveTypeLabel(request.type)
    },
    {
      key: 'period',
      label: 'Période',
      render: (request: LeaveRequest) => (
        <div>
          <div className="font-medium">
            {new Date(request.startDate).toLocaleDateString('fr-FR')} - {new Date(request.endDate).toLocaleDateString('fr-FR')}
          </div>
          <div className="text-sm text-gray-500">{request.days} jour(s)</div>
        </div>
      )
    },
    {
      key: 'reason',
      label: 'Raison',
      render: (request: LeaveRequest) => (
        <div className="max-w-xs truncate" title={request.reason}>
          {request.reason}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      sortable: true,
      render: (request: LeaveRequest) => getStatusBadge(request.status)
    },
    {
      key: 'submittedDate',
      label: 'Soumis le',
      sortable: true,
      render: (request: LeaveRequest) => (
        new Date(request.submittedDate).toLocaleDateString('fr-FR')
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (request: LeaveRequest) => (
        <div className="flex space-x-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleViewDetails(request)}
            title="Voir détails"
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          {request.status === 'pending' && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleCancelRequest(request.id)}
              title="Annuler"
            >
              <XMarkIcon className="h-4 w-4 text-red-600" />
            </Button>
          )}
        </div>
      )
    }
  ]

  const totalRequests = leaveRequests.length
  const pendingRequests = leaveRequests.filter(r => r.status === 'pending').length
  const approvedRequests = leaveRequests.filter(r => r.status === 'approved').length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes Congés</h1>
            <p className="text-gray-600">Gérez vos demandes de congés et consultez vos soldes</p>
          </div>
          <Button onClick={handleAddRequest}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Nouvelle demande
          </Button>
        </div>

        {/* Leave Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Congés payés</h3>
                <div className="mt-2">
                  <div className="text-3xl font-bold text-blue-600">{leaveBalance.vacation.remaining}</div>
                  <div className="text-sm text-gray-500">jours restants sur {leaveBalance.vacation.total}</div>
                </div>
              </div>
              <CalendarIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(leaveBalance.vacation.used / leaveBalance.vacation.total) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {leaveBalance.vacation.used} jours utilisés
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Congé maladie</h3>
                <div className="mt-2">
                  <div className="text-3xl font-bold text-green-600">{leaveBalance.sick.remaining}</div>
                  <div className="text-sm text-gray-500">jours restants sur {leaveBalance.sick.total}</div>
                </div>
              </div>
              <ClockIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(leaveBalance.sick.used / leaveBalance.sick.total) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {leaveBalance.sick.used} jours utilisés
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Congé personnel</h3>
                <div className="mt-2">
                  <div className="text-3xl font-bold text-purple-600">{leaveBalance.personal.remaining}</div>
                  <div className="text-sm text-gray-500">jours restants sur {leaveBalance.personal.total}</div>
                </div>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">P</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${(leaveBalance.personal.used / leaveBalance.personal.total) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {leaveBalance.personal.used} jours utilisés
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">{totalRequests}</div>
            <div className="text-sm text-gray-600">Total demandes</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">{pendingRequests}</div>
            <div className="text-sm text-gray-600">En attente</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{approvedRequests}</div>
            <div className="text-sm text-gray-600">Approuvées</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">
              {leaveBalance.vacation.remaining + leaveBalance.sick.remaining + leaveBalance.personal.remaining}
            </div>
            <div className="text-sm text-gray-600">Jours restants</div>
          </div>
        </div>

        {/* Requests Table */}
        <Table
          data={leaveRequests}
          columns={columns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        {/* Add Request Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Nouvelle demande de congé"
          maxWidth="lg"
        >
          <div className="space-y-4">
            <Select
              label="Type de congé"
              value={formData.type}
              onChange={(value) => setFormData({...formData, type: value as string})}
              options={leaveTypeOptions}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date de début"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                required
              />
              <Input
                label="Date de fin"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                required
              />
            </div>
            {formData.startDate && formData.endDate && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <span className="text-sm text-blue-700">
                  Durée: {calculateDays(formData.startDate, formData.endDate)} jour(s)
                </span>
              </div>
            )}
            <Input
              label="Raison"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              required
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit}>
                Soumettre
              </Button>
            </div>
          </div>
        </Modal>

        {/* Detail Modal */}
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title="Détails de la demande"
          maxWidth="lg"
        >
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <div className="mt-1 text-sm text-gray-900">
                    {getLeaveTypeLabel(selectedRequest.type)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Statut</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de début</label>
                  <div className="mt-1 text-sm text-gray-900">
                    {new Date(selectedRequest.startDate).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                  <div className="mt-1 text-sm text-gray-900">
                    {new Date(selectedRequest.endDate).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Durée</label>
                  <div className="mt-1 text-sm text-gray-900">
                    {selectedRequest.days} jour(s)
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Raison</label>
                <div className="mt-1 text-sm text-gray-900">
                  {selectedRequest.reason}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date de soumission</label>
                <div className="mt-1 text-sm text-gray-900">
                  {new Date(selectedRequest.submittedDate).toLocaleDateString('fr-FR')}
                </div>
              </div>

              {selectedRequest.approvedBy && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Approuvé par</label>
                  <div className="mt-1 text-sm text-gray-900">
                    {selectedRequest.approvedBy}
                  </div>
                </div>
              )}

              {selectedRequest.comments && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Commentaires</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {selectedRequest.comments}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button onClick={() => setIsDetailModalOpen(false)}>
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  )
}