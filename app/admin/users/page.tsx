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
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  department: string
  status: 'active' | 'inactive' | 'suspended'
  lastLogin: string
  createdAt: string
}

const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@mozart.com',
    role: 'manager',
    department: 'IT',
    status: 'active',
    lastLogin: '2024-01-15 14:30',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie.martin@mozart.com',
    role: 'employee',
    department: 'HR',
    status: 'active',
    lastLogin: '2024-01-15 09:15',
    createdAt: '2024-01-05'
  },
  {
    id: '3',
    firstName: 'Pierre',
    lastName: 'Bernard',
    email: 'pierre.bernard@mozart.com',
    role: 'hr',
    department: 'HR',
    status: 'inactive',
    lastLogin: '2024-01-10 16:45',
    createdAt: '2024-01-03'
  }
]

const roleOptions = [
  { value: 'admin', label: 'Administrateur' },
  { value: 'manager', label: 'Manager' },
  { value: 'hr', label: 'Ressources Humaines' },
  { value: 'employee', label: 'Employé' }
]

const departmentOptions = [
  { value: 'IT', label: 'Informatique' },
  { value: 'HR', label: 'Ressources Humaines' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Operations', label: 'Opérations' },
  { value: 'Sales', label: 'Ventes' }
]

const statusOptions = [
  { value: 'active', label: 'Actif' },
  { value: 'inactive', label: 'Inactif' },
  { value: 'suspended', label: 'Suspendu' }
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [sortColumn, setSortColumn] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    department: '',
    status: 'active'
  })

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleAddUser = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      department: '',
      status: 'active'
    })
    setIsAddModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status
    })
    setIsEditModalOpen(true)
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  const handleSubmit = (isEdit: boolean) => {
    if (isEdit && selectedUser) {
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...formData, status: formData.status as 'active' | 'inactive' | 'suspended' }
          : user
      ))
      setIsEditModalOpen(false)
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
        status: formData.status as 'active' | 'inactive' | 'suspended',
        lastLogin: 'Jamais',
        createdAt: new Date().toISOString().split('T')[0]
      }
      setUsers([...users, newUser])
      setIsAddModalOpen(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'success',
      inactive: 'warning',
      suspended: 'error'
    } as const
    
    const labels = {
      active: 'Actif',
      inactive: 'Inactif',
      suspended: 'Suspendu'
    }

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  const getRoleLabel = (role: string) => {
    const roleMap = {
      admin: 'Administrateur',
      manager: 'Manager',
      hr: 'RH',
      employee: 'Employé'
    }
    return roleMap[role as keyof typeof roleMap] || role
  }

  const columns = [
    {
      key: 'name',
      label: 'Nom',
      sortable: true,
      render: (user: User) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-gray-600" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Rôle',
      sortable: true,
      render: (user: User) => getRoleLabel(user.role)
    },
    {
      key: 'department',
      label: 'Département',
      sortable: true
    },
    {
      key: 'status',
      label: 'Statut',
      sortable: true,
      render: (user: User) => getStatusBadge(user.status)
    },
    {
      key: 'lastLogin',
      label: 'Dernière connexion',
      sortable: true
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (user: User) => (
        <div className="flex space-x-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleEditUser(user)}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleDeleteUser(user.id)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
            <p className="text-gray-600">Gérez les utilisateurs et leurs permissions</p>
          </div>
          <Button onClick={handleAddUser}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Ajouter un utilisateur
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">{users.length}</div>
            <div className="text-sm text-gray-600">Utilisateurs total</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Actifs</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">
              {users.filter(u => u.status === 'inactive').length}
            </div>
            <div className="text-sm text-gray-600">Inactifs</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">
              {users.filter(u => u.status === 'suspended').length}
            </div>
            <div className="text-sm text-gray-600">Suspendus</div>
          </div>
        </div>

        {/* Users Table */}
        <Table
          data={users}
          columns={columns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        {/* Add User Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Ajouter un utilisateur"
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
              <Input
                label="Nom"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
            </div>
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              icon={<EnvelopeIcon />}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Rôle"
                value={formData.role}
                onChange={(value) => setFormData({...formData, role: value as string})}
                options={roleOptions}
              />
              <Select
                label="Département"
                value={formData.department}
                onChange={(value) => setFormData({...formData, department: value as string})}
                options={departmentOptions}
              />
            </div>
            <Select
              label="Statut"
              value={formData.status}
              onChange={(value) => setFormData({...formData, status: value as string})}
              options={statusOptions}
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

        {/* Edit User Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Modifier l'utilisateur"
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
              <Input
                label="Nom"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
            </div>
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              icon={<EnvelopeIcon />}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Rôle"
                value={formData.role}
                onChange={(value) => setFormData({...formData, role: value as string})}
                options={roleOptions}
              />
              <Select
                label="Département"
                value={formData.department}
                onChange={(value) => setFormData({...formData, department: value as string})}
                options={departmentOptions}
              />
            </div>
            <Select
              label="Statut"
              value={formData.status}
              onChange={(value) => setFormData({...formData, status: value as string})}
              options={statusOptions}
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