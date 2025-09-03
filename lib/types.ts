export interface User {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: 'admin' | 'manager' | 'hr' | 'employee'
  department: string
  isActive: boolean
  createdAt: string
  lastLogin: string | null
}

export interface UserSession {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  department: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  department: string
}

export interface Role {
  name: string
  permissions: string[]
}

export interface Department {
  id: string
  name: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}