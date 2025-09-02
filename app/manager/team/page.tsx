'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import Table from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import {
  UserIcon,
  ClockIcon,
  CalendarIcon,
  ChartBarIcon,
  EyeIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

interface TeamMember {
  id: string
  firstName: string
  lastName: string
  email: string
  position: string
  status: 'present' | 'absent' | 'late' | 'onLeave'
  todayHours: string
  weekHours: string
  performance: number
  lastActivity: string
  profileImage?: string
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@mozart.com',
    position: 'Développeur Senior',
    status: 'present',
    todayHours: '7.5h',
    weekHours: '38h',
    performance: 95,
    lastActivity: '14:30'
  },
  {
    id: '2',
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@mozart.com',
    position: 'Développeur Junior',
    status: 'late',
    todayHours: '6h',
    weekHours: '32h',
    performance: 85,
    lastActivity: '13:45'
  },
  {
    id: '3',
    firstName: 'Carol',
    lastName: 'Brown',
    email: 'carol.brown@mozart.com',
    position: 'Designer UX/UI',
    status: 'present',
    todayHours: '8h',
    weekHours: '40h',
    performance: 92,
    lastActivity: '15:15'
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@mozart.com',
    position: 'Analyste',
    status: 'onLeave',
    todayHours: '0h',
    weekHours: '0h',
    performance: 88,
    lastActivity: 'Hier 17:00'
  }
]

export default function TeamPage() {
  const [teamMembers] = useState<TeamMember[]>(mockTeamMembers)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [sortColumn, setSortColumn] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleViewDetails = (member: TeamMember) => {
    setSelectedMember(member)
    setIsDetailModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      present: 'success',
      absent: 'error',
      late: 'warning',
      onLeave: 'info'
    } as const
    
    const labels = {
      present: 'Présent',
      absent: 'Absent',
      late: 'En retard',
      onLeave: 'En congé'
    }

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600'
    if (performance >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const columns = [
    {
      key: 'name',
      label: 'Employé',
      sortable: true,
      render: (member: TeamMember) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-gray-600" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {member.firstName} {member.lastName}
            </div>
            <div className="text-sm text-gray-500">{member.position}</div>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      sortable: true,
      render: (member: TeamMember) => getStatusBadge(member.status)
    },
    {
      key: 'todayHours',
      label: 'Heures aujourd\'hui',
      sortable: true,
      render: (member: TeamMember) => (
        <div className="flex items-center">
          <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
          {member.todayHours}
        </div>
      )
    },
    {
      key: 'weekHours',
      label: 'Heures semaine',
      sortable: true,
      render: (member: TeamMember) => (
        <div className="flex items-center">
          <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
          {member.weekHours}
        </div>
      )
    },
    {
      key: 'performance',
      label: 'Performance',
      sortable: true,
      render: (member: TeamMember) => (
        <div className="flex items-center">
          <ChartBarIcon className="h-4 w-4 text-gray-400 mr-2" />
          <span className={`font-medium ${getPerformanceColor(member.performance)}`}>
            {member.performance}%
          </span>
        </div>
      )
    },
    {
      key: 'lastActivity',
      label: 'Dernière activité',
      sortable: true
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (member: TeamMember) => (
        <Button
          size="icon"
          variant="ghost"
          onClick={() => handleViewDetails(member)}
        >
          <EyeIcon className="h-4 w-4" />
        </Button>
      )
    }
  ]

  const presentCount = teamMembers.filter(m => m.status === 'present').length
  const absentCount = teamMembers.filter(m => m.status === 'absent').length
  const lateCount = teamMembers.filter(m => m.status === 'late').length
  const onLeaveCount = teamMembers.filter(m => m.status === 'onLeave').length
  const avgPerformance = Math.round(teamMembers.reduce((sum, m) => sum + m.performance, 0) / teamMembers.length)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mon Équipe</h1>
            <p className="text-gray-600">Vue d'ensemble de votre équipe et de leurs performances</p>
          </div>
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Actions équipe
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">{teamMembers.length}</div>
            <div className="text-sm text-gray-600">Membres équipe</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{presentCount}</div>
            <div className="text-sm text-gray-600">Présents</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">{lateCount}</div>
            <div className="text-sm text-gray-600">En retard</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{onLeaveCount}</div>
            <div className="text-sm text-gray-600">En congé</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">{avgPerformance}%</div>
            <div className="text-sm text-gray-600">Performance moy.</div>
          </div>
        </div>

        {/* Team Table */}
        <Table
          data={teamMembers}
          columns={columns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        {/* Member Detail Modal */}
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={selectedMember ? `${selectedMember.firstName} ${selectedMember.lastName}` : ''}
          maxWidth="lg"
        >
          {selectedMember && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                  <UserIcon className="h-10 w-10 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedMember.firstName} {selectedMember.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedMember.position}</p>
                  <p className="text-sm text-gray-500">{selectedMember.email}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Statut actuel</div>
                  <div className="mt-1">
                    {getStatusBadge(selectedMember.status)}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Performance</div>
                  <div className={`text-lg font-semibold mt-1 ${getPerformanceColor(selectedMember.performance)}`}>
                    {selectedMember.performance}%
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Heures aujourd'hui</div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">
                    {selectedMember.todayHours}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Heures semaine</div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">
                    {selectedMember.weekHours}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Activité récente</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Dernière activité</span>
                    <span className="text-sm font-medium">{selectedMember.lastActivity}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Heures cette semaine</span>
                    <span className="text-sm font-medium">{selectedMember.weekHours} / 40h</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline">
                  Envoyer message
                </Button>
                <Button>
                  Voir détails complets
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  )
}