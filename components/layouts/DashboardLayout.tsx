'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from '../navigation/Sidebar'
import Navbar from '../navigation/Navbar'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          if (!pathname.startsWith('/login') && !pathname.startsWith('/register') && !pathname.startsWith('/forgot-password')) {
            router.push('/login')
          }
        }
      } catch (error) {
        if (!pathname.startsWith('/login') && !pathname.startsWith('/register') && !pathname.startsWith('/forgot-password')) {
          router.push('/login')
        }
      }
    }
    
    checkAuth()
  }, [router, pathname])

  const getPageTitle = () => {
    if (title) return title

    const titleMap: { [key: string]: string } = {
      '/dashboard': 'Tableau de Bord',
      '/employee/dashboard': 'Mon Tableau de Bord',
      '/admin/users': 'Gestion des Utilisateurs',
      '/admin/departments': 'Gestion des Départements',
      '/admin/roles': 'Rôles & Permissions',
      '/admin/settings': 'Paramètres Système',
      '/manager/team': 'Mon Équipe',
      '/manager/reports': 'Rapports d\'Équipe',
      '/manager/scheduling': 'Planification',
      '/hr/attendance': 'Gestion des Présences',
      '/hr/employees': 'Annuaire des Employés',
      '/hr/leave-management': 'Gestion des Congés',
      '/hr/performance': 'Évaluation de Performance',
      '/hr/reports': 'Rapports RH',
      '/employee/schedule': 'Mon Planning',
      '/employee/timesheet': 'Mes Feuilles de Temps',
      '/employee/leave': 'Mes Congés',
      '/employee/profile': 'Mon Profil'
    }

    return titleMap[pathname] || 'ERP Mozart Group'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="lg:pl-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} title={getPageTitle()} />
        
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}