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
  EyeIcon,
  PencilIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserIcon,
  StarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface PerformanceReview {
  id: string
  employeeId: string
  employeeName: string
  position: string
  department: string
  reviewPeriod: string
  reviewDate: string
  reviewer: string
  overallScore: number
  scores: {
    productivity: number
    quality: number
    teamwork: number
    communication: number
    leadership: number
    initiative: number
  }
  strengths: string[]
  areasForImprovement: string[]
  goals: string[]
  comments: string
  status: 'draft' | 'completed' | 'acknowledged'
  nextReviewDate: string
}

const mockPerformanceReviews: PerformanceReview[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: 'Alice Johnson',
    position: 'Développeur Senior',
    department: 'Informatique',
    reviewPeriod: '2024 Q1',
    reviewDate: '2024-01-15',
    reviewer: 'Jean Dupont',
    overallScore: 4.5,
    scores: {
      productivity: 5,
      quality: 4,
      teamwork: 5,
      communication: 4,
      leadership: 5,
      initiative: 4
    },
    strengths: [
      'Excellente maîtrise technique',
      'Leadership naturel',
      'Mentor efficace pour les juniors'
    ],
    areasForImprovement: [
      'Gestion du temps sur les projets complexes',
      'Documentation des processus'
    ],
    goals: [
      'Obtenir la certification architecture cloud',
      'Diriger le projet de refactoring',
      'Former 2 nouveaux développeurs'
    ],
    comments: 'Performance exceptionnelle ce trimestre. Prête pour plus de responsabilités.',
    status: 'completed',
    nextReviewDate: '2024-04-15'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: 'Bob Smith',
    position: 'Développeur Junior',
    department: 'Informatique',
    reviewPeriod: '2024 Q1',
    reviewDate: '2024-01-10',
    reviewer: 'Jean Dupont',
    overallScore: 3.8,
    scores: {
      productivity: 4,
      quality: 3,
      teamwork: 4,
      communication: 4,
      leadership: 3,
      initiative: 4
    },
    strengths: [
      'Très motivé et curieux',
      'S\'adapte rapidement aux nouvelles technologies',
      'Bon esprit d\'équipe'
    ],
    areasForImprovement: [
      'Qualité du code - revue des standards',
      'Confiance en soi lors des présentations',
      'Autonomie sur les tâches complexes'
    ],
    goals: [
      'Terminer la formation React avancée',
      'Prendre en charge un module complet',
      'Améliorer les pratiques de test'
    ],
    comments: 'Progression constante. Beaucoup de potentiel à développer.',
    status: 'acknowledged',
    nextReviewDate: '2024-04-10'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    employeeName: 'Carol Brown',
    position: 'Designer UX/UI',
    department: 'Design',
    reviewPeriod: '2024 Q1',
    reviewDate: '2024-01-12',
    reviewer: 'Marie Martin',
    overallScore: 4.2,
    scores: {
      productivity: 4,
      quality: 5,
      teamwork: 4,
      communication: 4,
      leadership: 4,
      initiative: 4
    },
    strengths: [
      'Créativité exceptionnelle',
      'Attention aux détails',
      'Compréhension utilisateur approfondie'
    ],
    areasForImprovement: [
      'Respect des délais',
      'Collaboration avec les développeurs',
      'Présentation des concepts'
    ],
    goals: [
      'Optimiser le processus de design',
      'Créer une librairie de composants',
      'Mener une étude utilisateur'
    ],
    comments: 'Excellent travail sur l\'expérience utilisateur. Design de haute qualité.',
    status: 'completed',
    nextReviewDate: '2024-04-12'
  }
]

const departmentOptions = [
  { value: '', label: 'Tous les départements' },
  { value: 'Informatique', label: 'Informatique' },
  { value: 'Design', label: 'Design' },
  { value: 'Finance', label: 'Finance' },
  { value: 'RH', label: 'Ressources Humaines' }
]

const statusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'draft', label: 'Brouillon' },
  { value: 'completed', label: 'Terminé' },
  { value: 'acknowledged', label: 'Pris en compte' }
]

const periodOptions = [
  { value: '2024 Q1', label: '2024 Q1' },
  { value: '2023 Q4', label: '2023 Q4' },
  { value: '2023 Q3', label: '2023 Q3' },
  { value: '2023 Q2', label: '2023 Q2' }
]

export default function PerformancePage() {
  const [reviews, setReviews] = useState<PerformanceReview[]>(mockPerformanceReviews)
  const [filteredReviews, setFilteredReviews] = useState<PerformanceReview[]>(mockPerformanceReviews)
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [sortColumn, setSortColumn] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    period: ''
  })

  const [newReview, setNewReview] = useState({
    employeeId: '',
    reviewPeriod: '2024 Q1',
    reviewer: 'Marie Martin'
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
    
    let filtered = reviews.filter(review => {
      const departmentMatch = !newFilters.department || review.department === newFilters.department
      const statusMatch = !newFilters.status || review.status === newFilters.status
      const periodMatch = !newFilters.period || review.reviewPeriod === newFilters.period
      
      return departmentMatch && statusMatch && periodMatch
    })
    
    setFilteredReviews(filtered)
  }

  const handleViewDetails = (review: PerformanceReview) => {
    setSelectedReview(review)
    setIsDetailModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'warning',
      completed: 'success',
      acknowledged: 'info'
    } as const
    
    const labels = {
      draft: 'Brouillon',
      completed: 'Terminé',
      acknowledged: 'Pris en compte'
    }

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  const getPerformanceBadge = (score: number) => {
    let variant: 'success' | 'info' | 'warning' | 'error' = 'success'
    let label = 'Excellent'

    if (score < 2) {
      variant = 'error'
      label = 'Faible'
    } else if (score < 3) {
      variant = 'warning'
      label = 'À améliorer'
    } else if (score < 4) {
      variant = 'info'
      label = 'Bon'
    } else if (score < 4.5) {
      variant = 'success'
      label = 'Très bon'
    }

    return (
      <Badge variant={variant}>
        {label} ({score.toFixed(1)})
      </Badge>
    )
  }

  const renderStars = (score: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-4 w-4 ${
              star <= score ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const columns = [
    {
      key: 'employee',
      label: 'Employé',
      sortable: true,
      render: (review: PerformanceReview) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-gray-600" />
            </div>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{review.employeeName}</div>
            <div className="text-sm text-gray-500">{review.position}</div>
          </div>
        </div>
      )
    },
    {
      key: 'department',
      label: 'Département',
      sortable: true
    },
    {
      key: 'reviewPeriod',
      label: 'Période',
      sortable: true
    },
    {
      key: 'overallScore',
      label: 'Score global',
      sortable: true,
      render: (review: PerformanceReview) => (
        <div className="flex items-center space-x-2">
          {renderStars(review.overallScore)}
          <span className="text-sm font-medium">{review.overallScore.toFixed(1)}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      sortable: true,
      render: (review: PerformanceReview) => getStatusBadge(review.status)
    },
    {
      key: 'nextReviewDate',
      label: 'Prochaine éval.',
      sortable: true,
      render: (review: PerformanceReview) => formatDate(review.nextReviewDate)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (review: PerformanceReview) => (
        <div className="flex space-x-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleViewDetails(review)}
            title="Voir détails"
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            title="Modifier"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  const avgScore = reviews.reduce((sum, review) => sum + review.overallScore, 0) / reviews.length
  const completedReviews = reviews.filter(r => r.status === 'completed').length
  const pendingReviews = reviews.filter(r => r.status === 'draft').length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Évaluation de Performance</h1>
            <p className="text-gray-600">Gérez les évaluations et le développement des employés</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Nouvelle évaluation
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{reviews.length}</div>
                <div className="text-sm text-gray-600">Total évaluations</div>
              </div>
              <ChartBarIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{completedReviews}</div>
                <div className="text-sm text-gray-600">Terminées</div>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">✓</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{pendingReviews}</div>
                <div className="text-sm text-gray-600">En attente</div>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{avgScore.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Score moyen</div>
              </div>
              <ArrowTrendingUpIcon className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              value={filters.period}
              onChange={(value) => handleFilterChange('period', value as string)}
              options={periodOptions.map(p => ({ value: p.value, label: p.label }))}
              placeholder="Période"
            />
          </div>
        </div>

        {/* Reviews Table */}
        <Table
          data={filteredReviews}
          columns={columns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        {/* Detail Modal */}
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title="Détails de l'évaluation"
          maxWidth="4xl"
        >
          {selectedReview && (
            <div className="space-y-6">
              {/* Employee Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedReview.employeeName}</h2>
                    <p className="text-gray-600">{selectedReview.position} • {selectedReview.department}</p>
                    <p className="text-sm text-gray-500">Période: {selectedReview.reviewPeriod}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600">{selectedReview.overallScore.toFixed(1)}</div>
                  <div className="text-sm text-gray-500">Score global</div>
                  {getPerformanceBadge(selectedReview.overallScore)}
                </div>
              </div>

              {/* Scores Grid */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Scores détaillés</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(selectedReview.scores).map(([key, score]) => {
                    const labels = {
                      productivity: 'Productivité',
                      quality: 'Qualité',
                      teamwork: 'Travail d\'équipe',
                      communication: 'Communication',
                      leadership: 'Leadership',
                      initiative: 'Initiative'
                    }
                    return (
                      <div key={key} className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-700">
                          {labels[key as keyof typeof labels]}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          {renderStars(score)}
                          <span className="text-lg font-bold text-gray-900">{score}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Strengths and Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Points forts</h3>
                  <div className="space-y-2">
                    {selectedReview.strengths.map((strength, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Points d'amélioration</h3>
                  <div className="space-y-2">
                    {selectedReview.areasForImprovement.map((area, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Goals */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Objectifs pour la prochaine période</h3>
                <div className="space-y-2">
                  {selectedReview.goals.map((goal, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{goal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Commentaires</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{selectedReview.comments}</p>
                </div>
              </div>

              {/* Review Info */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <div className="text-sm font-medium text-gray-700">Évaluateur</div>
                  <div className="text-sm text-gray-900">{selectedReview.reviewer}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Date d'évaluation</div>
                  <div className="text-sm text-gray-900">{formatDate(selectedReview.reviewDate)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Statut</div>
                  <div className="mt-1">{getStatusBadge(selectedReview.status)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Prochaine évaluation</div>
                  <div className="text-sm text-gray-900">{formatDate(selectedReview.nextReviewDate)}</div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => setIsDetailModalOpen(false)}>
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Add Review Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Nouvelle évaluation"
          maxWidth="md"
        >
          <div className="space-y-4">
            <Input
              label="ID Employé"
              value={newReview.employeeId}
              onChange={(e) => setNewReview({...newReview, employeeId: e.target.value})}
              placeholder="EMP001"
            />
            <Select
              label="Période d'évaluation"
              value={newReview.reviewPeriod}
              onChange={(value) => setNewReview({...newReview, reviewPeriod: value as string})}
              options={periodOptions}
            />
            <Input
              label="Évaluateur"
              value={newReview.reviewer}
              onChange={(e) => setNewReview({...newReview, reviewer: e.target.value})}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => setIsAddModalOpen(false)}>
                Créer l'évaluation
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}