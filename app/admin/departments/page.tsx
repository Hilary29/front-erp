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
  BuildingOfficeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

interface Department {
  id: string
  name: string
  description: string
  manager: string
  employeeCount: number
  budget: number
  status: 'active' | 'inactive'
  createdAt: string
}

const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Informatique',
    description: 'Développement et maintenance des systèmes informatiques',
    manager: 'Jean Dupont',
    employeeCount: 12,
    budget: 150000,
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Ressources Humaines',
    description: 'Gestion du personnel et des ressources humaines',
    manager: 'Marie Martin',
    employeeCount: 5,
    budget: 80000,
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '3',
    name: 'Finance',
    description: 'Gestion financière et comptabilité',
    manager: 'Pierre Bernard',
    employeeCount: 8,
    budget: 120000,
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '4',
    name: 'Marketing',
    description: 'Stratégie marketing et communication',
    manager: 'Sophie Dubois',
    employeeCount: 6,
    budget: 90000,
    status: 'inactive',
    createdAt: '2024-01-01'
  }
]

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [sortColumn, setSortColumn] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manager: '',
    budget: '',
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

  const handleAddDepartment = () => {
    setFormData({
      name: '',
      description: '',
      manager: '',
      budget: '',
      status: 'active'
    })
    setIsAddModalOpen(true)
  }

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department)
    setFormData({
      name: department.name,
      description: department.description,
      manager: department.manager,
      budget: department.budget.toString(),
      status: department.status
    })
    setIsEditModalOpen(true)
  }

  const handleDeleteDepartment = (departmentId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce département ?')) {
      setDepartments(departments.filter(dept => dept.id !== departmentId))
    }
  }

  const handleSubmit = (isEdit: boolean) => {
    if (isEdit && selectedDepartment) {
      setDepartments(departments.map(dept => 
        dept.id === selectedDepartment.id 
          ? { 
              ...dept, 
              ...formData,
              budget: parseInt(formData.budget) || 0,
              status: formData.status as 'active' | 'inactive'
            }
          : dept
      ))
      setIsEditModalOpen(false)
    } else {
      const newDepartment: Department = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        manager: formData.manager,
        budget: parseInt(formData.budget) || 0,
        status: formData.status as 'active' | 'inactive',
        employeeCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setDepartments([...departments, newDepartment])
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const columns = [
    {
      key: 'name',
      label: 'Département',
      sortable: true,
      render: (dept: Department) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <BuildingOfficeIcon className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{dept.name}</div>
            <div className="text-sm text-gray-500">{dept.description}</div>
          </div>
        </div>
      )
    },
    {
      key: 'manager',
      label: 'Manager',
      sortable: true
    },
    {
      key: 'employeeCount',
      label: 'Employés',
      sortable: true,
      render: (dept: Department) => (
        <div className="flex items-center">
          <UserGroupIcon className="h-4 w-4 text-gray-400 mr-2" />
          {dept.employeeCount}
        </div>
      )
    },
    {
      key: 'budget',
      label: 'Budget',
      sortable: true,
      render: (dept: Department) => formatCurrency(dept.budget)
    },
    {
      key: 'status',
      label: 'Statut',
      sortable: true,
      render: (dept: Department) => getStatusBadge(dept.status)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (dept: Department) => (
        <div className="flex space-x-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleEditDepartment(dept)}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleDeleteDepartment(dept.id)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employeeCount, 0)
  const totalBudget = departments.reduce((sum, dept) => sum + dept.budget, 0)
  const activeDepartments = departments.filter(dept => dept.status === 'active').length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Départements</h1>
            <p className="text-gray-600">Gérez les départements et leur organisation</p>
          </div>
          <Button onClick={handleAddDepartment}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Ajouter un département
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">{departments.length}</div>
            <div className="text-sm text-gray-600">Départements total</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{activeDepartments}</div>
            <div className="text-sm text-gray-600">Départements actifs</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{totalEmployees}</div>
            <div className="text-sm text-gray-600">Employés total</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalBudget)}</div>
            <div className="text-sm text-gray-600">Budget total</div>
          </div>
        </div>

        {/* Departments Table */}
        <Table
          data={departments}
          columns={columns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        {/* Add Department Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Ajouter un département"
          maxWidth="lg"
        >
          <div className="space-y-4">
            <Input
              label="Nom du département"
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
            <Input
              label="Manager"
              value={formData.manager}
              onChange={(e) => setFormData({...formData, manager: e.target.value})}
              required
            />
            <Input
              label="Budget (€)"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
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

        {/* Edit Department Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Modifier le département"
          maxWidth="lg"
        >
          <div className="space-y-4">
            <Input
              label="Nom du département"
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
            <Input
              label="Manager"
              value={formData.manager}
              onChange={(e) => setFormData({...formData, manager: e.target.value})}
              required
            />
            <Input
              label="Budget (€)"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
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