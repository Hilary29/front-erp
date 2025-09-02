'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bars3Icon,
  BellIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'

interface NavbarProps {
  onMenuClick: () => void
  title?: string
}

export default function Navbar({ onMenuClick, title }: NavbarProps) {
  const router = useRouter()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'Utilisateur'
    const role = localStorage.getItem('userRole') || 'employee'
    setUserName(name)
    setUserRole(role)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    router.push('/login')
  }

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      admin: 'Administrateur',
      manager: 'Manager',
      hr: 'Ressources Humaines',
      employee: 'Employé'
    }
    return roleNames[role as keyof typeof roleNames] || 'Utilisateur'
  }

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {title && (
              <h1 className="ml-4 lg:ml-0 text-xl font-semibold text-gray-900">
                {title}
              </h1>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <span className="sr-only">Voir les notifications</span>
              <div className="relative">
                <BellIcon className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </div>
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center max-w-xs bg-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <span className="sr-only">Ouvrir le menu utilisateur</span>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-700">{userName}</div>
                    <div className="text-xs text-gray-500">{getRoleDisplayName(userRole)}</div>
                  </div>
                  <ChevronDownIcon className="hidden md:block h-4 w-4 text-gray-400" />
                </div>
              </button>

              {/* Profile dropdown menu */}
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <div className="block px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <div className="font-medium">{userName}</div>
                      <div className="text-xs text-gray-500">{getRoleDisplayName(userRole)}</div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setIsProfileOpen(false)
                        router.push('/employee/profile')
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <UserIcon className="h-4 w-4 mr-3 text-gray-400" />
                      Mon Profil
                    </button>
                    
                    <button
                      onClick={() => {
                        setIsProfileOpen(false)
                        router.push('/settings')
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Cog6ToothIcon className="h-4 w-4 mr-3 text-gray-400" />
                      Paramètres
                    </button>
                    
                    <div className="border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3 text-red-400" />
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close profile dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  )
}