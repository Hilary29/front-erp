'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  UserGroupIcon,
  ClockIcon,
  UserIcon,
  BriefcaseIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  Bars3Icon
} from '@heroicons/react/24/outline'

interface NavigationItem {
  name: string
  href: string
  icon: any
  roles: string[]
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    roles: ['admin', 'manager', 'hr']
  },
  {
    name: 'Mon Dashboard',
    href: '/employee/dashboard',
    icon: HomeIcon,
    roles: ['employee']
  },
  
  // Admin
  {
    name: 'Gestion Utilisateurs',
    href: '/admin/users',
    icon: UsersIcon,
    roles: ['admin']
  },
  {
    name: 'Départements',
    href: '/admin/departments',
    icon: BriefcaseIcon,
    roles: ['admin']
  },
  {
    name: 'Rôles & Permissions',
    href: '/admin/roles',
    icon: ExclamationTriangleIcon,
    roles: ['admin']
  },
  {
    name: 'Paramètres',
    href: '/admin/settings',
    icon: CogIcon,
    roles: ['admin']
  },

  // Manager
  {
    name: 'Mon Équipe',
    href: '/manager/team',
    icon: UserGroupIcon,
    roles: ['manager']
  },
  {
    name: 'Rapports Équipe',
    href: '/manager/reports',
    icon: ChartBarIcon,
    roles: ['manager']
  },
  {
    name: 'Planning',
    href: '/manager/scheduling',
    icon: CalendarIcon,
    roles: ['manager']
  },

  // HR
  {
    name: 'Présences',
    href: '/hr/attendance',
    icon: ClockIcon,
    roles: ['hr', 'admin']
  },
  {
    name: 'Annuaire',
    href: '/hr/employees',
    icon: UsersIcon,
    roles: ['hr', 'admin']
  },
  {
    name: 'Gestion Congés',
    href: '/hr/leave-management',
    icon: CalendarIcon,
    roles: ['hr', 'admin']
  },
  {
    name: 'Performance',
    href: '/hr/performance',
    icon: ChartBarIcon,
    roles: ['hr', 'admin']
  },
  {
    name: 'Rapports RH',
    href: '/hr/reports',
    icon: DocumentTextIcon,
    roles: ['hr', 'admin']
  },

  // Employee
  {
    name: 'Mon Planning',
    href: '/employee/schedule',
    icon: CalendarIcon,
    roles: ['employee']
  },
  {
    name: 'Feuilles de Temps',
    href: '/employee/timesheet',
    icon: ClockIcon,
    roles: ['employee']
  },
  {
    name: 'Mes Congés',
    href: '/employee/leave',
    icon: CalendarIcon,
    roles: ['employee']
  },
  {
    name: 'Mon Profil',
    href: '/employee/profile',
    icon: UserIcon,
    roles: ['employee']
  }
]

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<string>('employee')

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'employee'
    setUserRole(role)
  }, [])

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(userRole)
  )

  const isCurrentPath = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') return true
    if (href !== '/dashboard' && pathname.startsWith(href)) return true
    return false
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ERP</span>
              </div>
            </div>
            <h1 className="ml-3 text-lg font-semibold text-gray-900">Mozart Group</h1>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = isCurrentPath(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                    ${isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                      : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200
                      ${isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-primary-500'}
                    `}
                  />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-gray-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Utilisateur</p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}