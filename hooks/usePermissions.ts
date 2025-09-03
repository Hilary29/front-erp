'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface UsePermissionsReturn {
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  hasAllPermissions: (permissions: string[]) => boolean
  isAdmin: boolean
  isManager: boolean
  isHR: boolean
  isEmployee: boolean
}

export function usePermissions(): UsePermissionsReturn {
  const { user } = useAuth()
  const [rolePermissions, setRolePermissions] = useState<string[]>([])

  useEffect(() => {
    const loadPermissions = async () => {
      if (user?.role) {
        // Pour cette implémentation simple, on définit les permissions côté client
        // Dans une vraie app, on ferait un appel API
        const permissions: Record<string, string[]> = {
          admin: ['*'],
          manager: ['dashboard', 'team', 'reports', 'scheduling'],
          hr: ['employees', 'leave', 'performance', 'reports', 'attendance'],
          employee: ['profile', 'timesheet', 'leave', 'schedule']
        }
        
        setRolePermissions(permissions[user.role] || [])
      }
    }

    loadPermissions()
  }, [user])

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return rolePermissions.includes('*') || rolePermissions.includes(permission)
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission))
  }

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission))
  }

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager',
    isHR: user?.role === 'hr',
    isEmployee: user?.role === 'employee'
  }
}