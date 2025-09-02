'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import Table from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import Select from '@/components/ui/Select'
import {
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ClockIcon,
  CalendarIcon,
  FunnelIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  employeeEmail: string
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'unpaid'
  startDate: string
  endDate: string
  days: number
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  submittedDate: string
  approvedBy?: string
  approvedDate?: string
  comments?: string
  urgency: 'low' | 'medium' | 'high'
}

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: 'Alice Johnson',
    employeeEmail: 'alice.johnson@mozart.com',
    type: 'vacation',
    startDate: '2024-02-15',
    endDate: '2024-02-25',
    days: 10,
    reason: 'Vacances familiales',
    status: 'pending',
    submittedDate: '2024-01-10',
    urgency: 'medium'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: 'Bob Smith',
    employeeEmail: 'bob.smith@mozart.com',
    type: 'sick',
    startDate: '2024-01-20',
    endDate: '2024-01-22',
    days: 2,
    reason: 'Grippe avec certificat médical',
    status: 'approved',
    submittedDate: '2024-01-20',
    approvedBy: 'Marie Martin',
    approvedDate: '2024-01-20',
    urgency: 'high'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    employeeName: 'Carol Brown',
    employeeEmail: 'carol.brown@mozart.com',
    type: 'personal',
    startDate: '2024-03-10',
    endDate: '2024-03-10',
    days: 1,
    reason: 'Rendez-vous médical urgent',
    status: 'pending',
    submittedDate: '2024-01-15',
    urgency: 'high'
  },
  {
    id: '4',
    employeeId: 'EMP004',
    employeeName: 'David Wilson',
    employeeEmail: 'david.wilson@mozart.com',
    type: 'vacation',
    startDate: '2024-04-01',
    endDate: '2024-04-05',
    days: 5,
    reason: 'Vacances de printemps',
    status: 'rejected',
    submittedDate: '2024-01-12',
    approvedBy: 'Marie Martin',
    approvedDate: '2024-01-13',
    comments: 'Période trop chargée, merci de choisir une autre période.',
    urgency: 'low'
  },
  {
    id: '5',
    employeeId: 'EMP005',
    employeeName: 'Eve Davis',
    employeeEmail: 'eve.davis@mozart.com',
    type: 'maternity',
    startDate: '2024-06-01',
    endDate: '2024-09-01',
    days: 92,
    reason: 'Congé maternité',
    status: 'approved',
    submittedDate: '2024-01-05',
    approvedBy: 'Marie Martin',
    approvedDate: '2024-01-06',
    urgency: 'medium'
  }
]

const typeOptions = [
  { value: '', label: 'Tous les types' },
  { value: 'vacation', label: 'Congés payés' },
  { value: 'sick', label: 'Congé maladie' },
  { value: 'personal', label: 'Congé personnel' },
  { value: 'maternity', label: 'Congé maternité' },
  { value: 'unpaid', label: 'Congé sans solde' }
]

const statusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'pending', label: 'En attente' },
  { value: 'approved', label: 'Approuvé' },
  { value: 'rejected', label: 'Rejeté' },
  { value: 'cancelled', label: 'Annulé' }
]

const urgencyOptions = [
  { value: '', label: 'Toutes les urgences' },
  { value: 'high', label: 'Haute' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'low', label: 'Basse' }
]

export default function LeaveManagementPage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests)
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>(mockLeaveRequests)
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false)
  const [sortColumn, setSortColumn] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [approvalComments, setApprovalComments] = useState('')
  
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    urgency: ''
  })

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    let filtered = leaveRequests.filter(request => {
      const typeMatch = !newFilters.type || request.type === newFilters.type
      const statusMatch = !newFilters.status || request.status === newFilters.status
      const urgencyMatch = !newFilters.urgency || request.urgency === newFilters.urgency
      
      return typeMatch && statusMatch && urgencyMatch
    })
    
    setFilteredRequests(filtered)
  }

  const handleViewDetails = (request: LeaveRequest) => {
    setSelectedRequest(request)
    setIsDetailModalOpen(true)
  }

  const handleApprovalAction = (request: LeaveRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request)
    setApprovalComments('')
    setIsApprovalModalOpen(true)
  }

  const handleApprovalSubmit = (action: 'approve' | 'reject') => {
    if (!selectedRequest) return

    const updatedRequest: LeaveRequest = {
      ...selectedRequest,
      status: action === 'approve' ? 'approved' : 'rejected',
      approvedBy: 'Marie Martin', // Current HR user
      approvedDate: new Date().toISOString().split('T')[0],
      comments: approvalComments || undefined
    }

    setLeaveRequests(leaveRequests.map(req => 
      req.id === selectedRequest.id ? updatedRequest : req
    ))
    
    // Update filtered requests as well
    setFilteredRequests(filteredRequests.map(req => 
      req.id === selectedRequest.id ? updatedRequest : req
    ))

    setIsApprovalModalOpen(false)
    setApprovalComments('')
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

  const getUrgencyBadge = (urgency: string) => {
    const variants = {
      high: 'error',
      medium: 'warning',
      low: 'default'
    } as const
    
    const labels = {
      high: 'Haute',
      medium: 'Moyenne',
      low: 'Basse'
    }

    return (
      <Badge variant={variants[urgency as keyof typeof variants]} size="sm">
        {labels[urgency as keyof typeof labels]}
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const columns = [
    {
      key: 'employee',
      label: 'Employé',
      sortable: true,
      render: (request: LeaveRequest) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-gray-600" />
            </div>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
            <div className="text-sm text-gray-500">{request.employeeId}</div>
          </div>
        </div>
      )
    },
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
          <div className="text-sm font-medium text-gray-900">
            {formatDate(request.startDate)} - {formatDate(request.endDate)}
          </div>
          <div className="text-sm text-gray-500">{request.days} jour(s)</div>
        </div>
      )
    },
    {
      key: 'submittedDate',
      label: 'Soumis le',
      sortable: true,
      render: (request: LeaveRequest) => formatDate(request.submittedDate)
    },
    {
      key: 'urgency',
      label: 'Urgence',
      sortable: true,
      render: (request: LeaveRequest) => getUrgencyBadge(request.urgency)
    },
    {
      key: 'status',
      label: 'Statut',
      sortable: true,
      render: (request: LeaveRequest) => getStatusBadge(request.status)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (request: LeaveRequest) => (
        <div className="flex space-x-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleViewDetails(request)}
            title="Voir détails"
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          {request.status === 'pending' && (
            <>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleApprovalAction(request, 'approve')}
                title="Approuver"
              >
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleApprovalAction(request, 'reject')}
                title="Rejeter"
              >
                <XCircleIcon className="h-4 w-4 text-red-600" />
              </Button>
            </>
          )}
        </div>
      )
    }
  ]

  const totalRequests = leaveRequests.length
  const pendingRequests = leaveRequests.filter(r => r.status === 'pending').length
  const approvedRequests = leaveRequests.filter(r => r.status === 'approved').length
  const totalDaysRequested = leaveRequests.reduce((sum, req) => sum + req.days, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Congés</h1>
          <p className="text-gray-600">Approuvez et gérez les demandes de congés des employés</p>
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
            <div className="text-2xl font-bold text-blue-600">{totalDaysRequested}</div>
            <div className="text-sm text-gray-600">Jours demandés</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-4 mb-4">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Filtres</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              value={filters.type}
              onChange={(value) => handleFilterChange('type', value as string)}
              options={typeOptions}
              placeholder="Type de congé"
            />
            <Select
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value as string)}
              options={statusOptions}
              placeholder="Statut"
            />
            <Select
              value={filters.urgency}
              onChange={(value) => handleFilterChange('urgency', value as string)}
              options={urgencyOptions}
              placeholder="Urgence"
            />
          </div>
        </div>

        {/* Requests Table */}
        <Table
          data={filteredRequests}
          columns={columns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        {/* Detail Modal */}
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title="Détails de la demande"
          maxWidth="lg"
        >
          {selectedRequest && (
            <div className="space-y-6">
              {/* Employee Info */}
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedRequest.employeeName}</h3>
                  <p className="text-sm text-gray-500">{selectedRequest.employeeEmail}</p>
                  <p className="text-sm text-gray-500">ID: {selectedRequest.employeeId}</p>
                </div>
              </div>

              {/* Request Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type de congé</label>
                  <div className="mt-1 text-sm text-gray-900">
                    {getLeaveTypeLabel(selectedRequest.type)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Urgence</label>
                  <div className="mt-1">
                    {getUrgencyBadge(selectedRequest.urgency)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de début</label>
                  <div className="mt-1 text-sm text-gray-900">
                    {formatDate(selectedRequest.startDate)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                  <div className="mt-1 text-sm text-gray-900">
                    {formatDate(selectedRequest.endDate)}
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
                <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm text-gray-900">
                  {selectedRequest.reason}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de soumission</label>
                  <div className="mt-1 text-sm text-gray-900">
                    {formatDate(selectedRequest.submittedDate)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Statut</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>
              </div>

              {selectedRequest.approvedBy && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Traité par</label>
                    <div className="mt-1 text-sm text-gray-900">
                      {selectedRequest.approvedBy}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date de traitement</label>
                    <div className="mt-1 text-sm text-gray-900">
                      {selectedRequest.approvedDate && formatDate(selectedRequest.approvedDate)}
                    </div>
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

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                {selectedRequest.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsDetailModalOpen(false)
                        handleApprovalAction(selectedRequest, 'reject')
                      }}
                    >
                      <XCircleIcon className="h-4 w-4 mr-2" />
                      Rejeter
                    </Button>
                    <Button
                      onClick={() => {
                        setIsDetailModalOpen(false)
                        handleApprovalAction(selectedRequest, 'approve')
                      }}
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Approuver
                    </Button>
                  </>
                )}
                {selectedRequest.status !== 'pending' && (
                  <Button onClick={() => setIsDetailModalOpen(false)}>
                    Fermer
                  </Button>
                )}
              </div>
            </div>
          )}
        </Modal>

        {/* Approval Modal */}
        <Modal
          isOpen={isApprovalModalOpen}
          onClose={() => setIsApprovalModalOpen(false)}
          title="Traitement de la demande"
          maxWidth="md"
        >
          {selectedRequest && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedRequest.employeeName}
                </h3>
                <p className="text-sm text-gray-500">
                  {getLeaveTypeLabel(selectedRequest.type)} • {selectedRequest.days} jour(s)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commentaires (optionnel)
                </label>
                <textarea
                  rows={3}
                  value={approvalComments}
                  onChange={(e) => setApprovalComments(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Ajoutez un commentaire..."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsApprovalModalOpen(false)}>
                  Annuler
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleApprovalSubmit('reject')}
                >
                  <XCircleIcon className="h-4 w-4 mr-2" />
                  Rejeter
                </Button>
                <Button onClick={() => handleApprovalSubmit('approve')}>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Approuver
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  )
}