'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import Table from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon,
  UsersIcon
} from '@heroicons/react/24/outline'

interface Permission {
  id: string
  name: string
  description: string
  module: string
}

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
  status: 'active' | 'inactive'
  createdAt: string
}

const mockPermissions: Permission[] = [
  { id: '1', name: 'users.read', description: 'Voir les utilisateurs', module: 'Users' },
  { id: '2', name: 'users.write', description: 'Modifier les utilisateurs', module: 'Users' },
  { id: '3', name: 'users.delete', description: 'Supprimer les utilisateurs', module: 'Users' },
  { id: '4', name: 'departments.read', description: 'Voir les départements', module: 'Departments' },
  { id: '5', name: 'departments.write', description: 'Modifier les départements', module: 'Departments' },
  { id: '6', name: 'attendance.read', description: 'Voir les présences', module: 'Attendance' },
  { id: '7', name: 'attendance.write', description: 'Modifier les présences', module: 'Attendance' },
  { id: '8', name: 'reports.read', description: 'Voir les rapports', module: 'Reports' },
  { id: '9', name: 'settings.write', description: 'Modifier les paramètres', module: 'Settings' }
]

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Administrateur',
    description: 'Accès complet au système',
    permissions: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    userCount: 2,
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Manager',
    description: 'Gestion d\'équipe et rapports',
    permissions: ['1', '4', '6', '7', '8'],
    userCount: 5,
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '3',
    name: 'RH',
    description: 'Ressources humaines',
    permissions: ['1', '2', '4', '6', '7', '8'],
    userCount: 3,
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '4',
    name: 'Employé',
    description: 'Accès de base',
    permissions: ['6'],
    userCount: 25,
    status: 'active',
    createdAt: '2024-01-01'
  }
]

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [sortColumn, setSortColumn] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
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

  const handleAddRole = () => {
    setFormData({
      name: '',
      description: '',
      permissions: [],
      status: 'active'
    })
    setIsAddModalOpen(true)
  }

  const handleEditRole = (role: Role) => {
    setSelectedRole(role)
    setFormData({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions],
      status: role.status
    })
    setIsEditModalOpen(true)
  }

  const handleDeleteRole = (roleId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?')) {
      setRoles(roles.filter(role => role.id !== roleId))
    }
  }

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }))
  }

  const handleSubmit = (isEdit: boolean) => {
    if (isEdit && selectedRole) {
      setRoles(roles.map(role => 
        role.id === selectedRole.id 
          ? { 
              ...role, 
              name: formData.name,
              description: formData.description,
              permissions: formData.permissions,
              status: formData.status as 'active' | 'inactive'
            }
          : role
      ))
      setIsEditModalOpen(false)
    } else {
      const newRole: Role = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions,
        status: formData.status as 'active' | 'inactive',
        userCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setRoles([...roles, newRole])
      setIsAddModalOpen(false)
    }
  }

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === 'active' ? 'success' : 'warning'}>
        {status === 'active' ? 'Actif' : 'Inactif'}
      </Badge>
    )
  }

  const getPermissionsByModule = () => {
    const grouped = mockPermissions.reduce((acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = []
      }
      acc[permission.module].push(permission)
      return acc
    }, {} as Record<string, Permission[]>)
    return grouped
  }

  const columns = [
    {
      key: 'name',
      label: 'Rôle',
      sortable: true,
      render: (role: Role) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-lg bg-secondary-100 flex items-center justify-center">
              <ShieldCheckIcon className="h-6 w-6 text-secondary-600" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{role.name}</div>
            <div className="text-sm text-gray-500">{role.description}</div>
          </div>
        </div>
      )
    },
    {
      key: 'permissions',
      label: 'Permissions',
      render: (role: Role) => (
        <div className="text-sm text-gray-900">
          {role.permissions.length} permission(s)
        </div>
      )
    },
    {
      key: 'userCount',
      label: 'Utilisateurs',
      sortable: true,
      render: (role: Role) => (
        <div className="flex items-center">
          <UsersIcon className="h-4 w-4 text-gray-400 mr-2" />
          {role.userCount}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      sortable: true,
      render: (role: Role) => getStatusBadge(role.status)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (role: Role) => (
        <div className="flex space-x-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleEditRole(role)}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleDeleteRole(role.id)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  const permissionsByModule = getPermissionsByModule()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rôles & Permissions</h1>
            <p className="text-gray-600">Gérez les rôles et leurs permissions</p>
          </div>
          <Button onClick={handleAddRole}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Ajouter un rôle
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">{roles.length}</div>
            <div className="text-sm text-gray-600">Rôles total</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {roles.filter(r => r.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Rôles actifs</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">
              {roles.reduce((sum, role) => sum + role.userCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Utilisateurs assignés</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">{mockPermissions.length}</div>
            <div className="text-sm text-gray-600">Permissions disponibles</div>
          </div>
        </div>

        {/* Roles Table */}
        <Table
          data={roles}
          columns={columns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        {/* Add Role Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Ajouter un rôle"
          maxWidth="2xl"
        >
          <div className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Nom du rôle"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <Input
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Permissions</h3>
              <div className="space-y-4">
                {Object.entries(permissionsByModule).map(([module, permissions]) => (
                  <div key={module} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">{module}</h4>
                    <div className="space-y-2">
                      {permissions.map((permission) => (
                        <label key={permission.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(permission.id)}
                            onChange={() => handlePermissionToggle(permission.id)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-700">
                              {permission.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {permission.description}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

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

        {/* Edit Role Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Modifier le rôle"
          maxWidth="2xl"
        >
          <div className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Nom du rôle"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <Input
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Permissions</h3>
              <div className="space-y-4">
                {Object.entries(permissionsByModule).map(([module, permissions]) => (
                  <div key={module} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">{module}</h4>
                    <div className="space-y-2">
                      {permissions.map((permission) => (
                        <label key={permission.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(permission.id)}
                            onChange={() => handlePermissionToggle(permission.id)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-700">
                              {permission.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {permission.description}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

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