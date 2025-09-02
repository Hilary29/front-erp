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
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  EyeIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  BriefcaseIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

interface Employee {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  position: string
  department: string
  manager: string
  hireDate: string
  status: 'active' | 'inactive' | 'terminated'
  salary: number
  performance: 'excellent' | 'good' | 'average' | 'poor'
  lastReview: string
}

const mockEmployees: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@mozart.com',
    phone: '+33 1 23 45 67 89',
    position: 'Développeur Senior',
    department: 'Informatique',
    manager: 'Jean Dupont',
    hireDate: '2022-03-01',
    status: 'active',
    salary: 65000,
    performance: 'excellent',
    lastReview: '2024-01-15'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@mozart.com',
    phone: '+33 1 23 45 67 90',
    position: 'Développeur Junior',
    department: 'Informatique',
    manager: 'Jean Dupont',
    hireDate: '2023-06-15',
    status: 'active',
    salary: 45000,
    performance: 'good',
    lastReview: '2024-01-10'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    firstName: 'Carol',
    lastName: 'Brown',
    email: 'carol.brown@mozart.com',
    phone: '+33 1 23 45 67 91',
    position: 'Designer UX/UI',
    department: 'Design',
    manager: 'Marie Martin',
    hireDate: '2022-09-01',
    status: 'active',
    salary: 52000,
    performance: 'excellent',
    lastReview: '2024-01-12'
  },
  {
    id: '4',
    employeeId: 'EMP004',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@mozart.com',
    phone: '+33 1 23 45 67 92',
    position: 'Analyste',
    department: 'Finance',
    manager: 'Pierre Bernard',
    hireDate: '2021-11-15',
    status: 'inactive',
    salary: 48000,
    performance: 'average',
    lastReview: '2023-12-20'
  }
]

const departmentOptions = [
  { value: '', label: 'Tous les départements' },
  { value: 'Informatique', label: 'Informatique' },
  { value: 'Design', label: 'Design' },
  { value: 'Finance', label: 'Finance' },
  { value: 'RH', label: 'Ressources Humaines' },
  { value: 'Ventes', label: 'Ventes' }
]

const statusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'active', label: 'Actif' },
  { value: 'inactive', label: 'Inactif' },
  { value: 'terminated', label: 'Licencié' }
]

const performanceOptions = [
  { value: '', label: 'Toutes les performances' },
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Bon' },
  { value: 'average', label: 'Moyen' },
  { value: 'poor', label: 'Faible' }
]

export default function HREmployeesPage() {
  const [employees] = useState<Employee[]>(mockEmployees)
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(mockEmployees)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [sortColumn, setSortColumn] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    status: '',
    performance: ''
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
    
    let filtered = employees.filter(employee => {
      const searchMatch = !newFilters.search || 
        `${employee.firstName} ${employee.lastName} ${employee.email} ${employee.employeeId}`
          .toLowerCase()
          .includes(newFilters.search.toLowerCase())
      
      const departmentMatch = !newFilters.department || employee.department === newFilters.department
      const statusMatch = !newFilters.status || employee.status === newFilters.status
      const performanceMatch = !newFilters.performance || employee.performance === newFilters.performance
      
      return searchMatch && departmentMatch && statusMatch && performanceMatch
    })
    
    setFilteredEmployees(filtered)
  }

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsDetailModalOpen(true)
  }

  const handleExport = () => {
    alert('Annuaire exporté avec succès!')
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'success',
      inactive: 'warning',
      terminated: 'error'
    } as const
    
    const labels = {
      active: 'Actif',
      inactive: 'Inactif',
      terminated: 'Licencié'
    }

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  const getPerformanceBadge = (performance: string) => {
    const variants = {
      excellent: 'success',
      good: 'info',
      average: 'warning',
      poor: 'error'
    } as const
    
    const labels = {
      excellent: 'Excellent',
      good: 'Bon',
      average: 'Moyen',
      poor: 'Faible'
    }

    return (
      <Badge variant={variants[performance as keyof typeof variants]}>
        {labels[performance as keyof typeof labels]}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const calculateYearsOfService = (hireDateString: string) => {
    const hireDate = new Date(hireDateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - hireDate.getTime())
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25))
    return diffYears
  }

  const columns = [
    {
      key: 'employee',
      label: 'Employé',
      sortable: true,
      render: (employee: Employee) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-gray-600" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {employee.firstName} {employee.lastName}
            </div>
            <div className="text-sm text-gray-500">{employee.employeeId}</div>
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (employee: Employee) => (
        <div>
          <div className="text-sm text-gray-900">{employee.email}</div>
          <div className="text-sm text-gray-500">{employee.phone}</div>
        </div>
      )
    },
    {
      key: 'position',
      label: 'Poste',
      sortable: true,
      render: (employee: Employee) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{employee.position}</div>
          <div className="text-sm text-gray-500">{employee.department}</div>
        </div>
      )
    },
    {
      key: 'manager',
      label: 'Manager',
      sortable: true
    },
    {
      key: 'status',
      label: 'Statut',
      sortable: true,
      render: (employee: Employee) => getStatusBadge(employee.status)
    },
    {
      key: 'performance',
      label: 'Performance',
      sortable: true,
      render: (employee: Employee) => getPerformanceBadge(employee.performance)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (employee: Employee) => (
        <Button
          size="icon"
          variant="ghost"
          onClick={() => handleViewDetails(employee)}
          title="Voir détails"
        >
          <EyeIcon className="h-4 w-4" />
        </Button>
      )
    }
  ]

  const totalEmployees = employees.length
  const activeEmployees = employees.filter(e => e.status === 'active').length
  const avgSalary = Math.round(employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Annuaire des Employés</h1>
            <p className="text-gray-600">Consultez et gérez les informations de tous les employés</p>
          </div>
          <Button onClick={handleExport}>
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">{totalEmployees}</div>
            <div className="text-sm text-gray-600">Total employés</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{activeEmployees}</div>
            <div className="text-sm text-gray-600">Employés actifs</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(avgSalary)}</div>
            <div className="text-sm text-gray-600">Salaire moyen</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">
              {employees.filter(e => e.performance === 'excellent').length}
            </div>
            <div className="text-sm text-gray-600">Performance excellent</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-4 mb-4">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Filtres</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full text-sm"
              />
            </div>
            <Select
              value={filters.department}
              onChange={(value) => handleFilterChange('department', value as string)}
              options={departmentOptions}
              placeholder="Département"
            />
            <Select
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value as string)}
              options={statusOptions}
              placeholder="Statut"
            />
            <Select
              value={filters.performance}
              onChange={(value) => handleFilterChange('performance', value as string)}
              options={performanceOptions}
              placeholder="Performance"
            />
          </div>
        </div>

        {/* Employees Table */}
        <Table
          data={filteredEmployees}
          columns={columns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        {/* Employee Detail Modal */}
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : ''}
          maxWidth="2xl"
        >
          {selectedEmployee && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-6">
                <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                  <UserIcon className="h-12 w-12 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </h2>
                  <p className="text-gray-600">{selectedEmployee.position}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    {getStatusBadge(selectedEmployee.status)}
                    {getPerformanceBadge(selectedEmployee.performance)}
                  </div>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Informations personnelles</h3>
                  
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">Email</div>
                      <div className="text-sm text-gray-900">{selectedEmployee.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">Téléphone</div>
                      <div className="text-sm text-gray-900">{selectedEmployee.phone}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <BriefcaseIcon className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">ID Employé</div>
                      <div className="text-sm text-gray-900">{selectedEmployee.employeeId}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Informations professionnelles</h3>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-700">Département</div>
                    <div className="text-sm text-gray-900">{selectedEmployee.department}</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700">Manager</div>
                    <div className="text-sm text-gray-900">{selectedEmployee.manager}</div>
                  </div>

                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">Date d'embauche</div>
                      <div className="text-sm text-gray-900">
                        {formatDate(selectedEmployee.hireDate)} 
                        <span className="text-gray-500 ml-2">
                          ({calculateYearsOfService(selectedEmployee.hireDate)} ans de service)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700">Salaire</div>
                    <div className="text-sm text-gray-900">{formatCurrency(selectedEmployee.salary)}</div>
                  </div>
                </div>
              </div>

              {/* Performance Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-700">Évaluation actuelle</div>
                    <div className="mt-1">
                      {getPerformanceBadge(selectedEmployee.performance)}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-700">Dernière évaluation</div>
                    <div className="text-sm text-gray-900 mt-1">
                      {formatDate(selectedEmployee.lastReview)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline">
                  Envoyer message
                </Button>
                <Button variant="outline">
                  Voir planning
                </Button>
                <Button>
                  Éditer profil
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  )
}