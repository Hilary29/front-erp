import { Database } from './database'
import { createSession, destroySession } from './session'
import { hashPassword, verifyPassword } from '../utils/password'
import { validateLoginData, validateRegisterData } from '../utils/validation'
import { LoginCredentials, RegisterData, UserSession, ApiResponse } from '../types'

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<ApiResponse<UserSession>> {
    try {
      // Validate input
      const validation = validateLoginData(credentials)
      if (!validation.valid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        }
      }

      // Find user
      const user = await Database.getUserByEmail(credentials.email)
      if (!user) {
        return {
          success: false,
          error: 'Email ou mot de passe incorrect'
        }
      }

      // Check if user is active
      if (!user.isActive) {
        return {
          success: false,
          error: 'Compte désactivé. Contactez l\'administrateur.'
        }
      }

      // Verify password
      const isValidPassword = await verifyPassword(credentials.password, user.password)
      if (!isValidPassword) {
        return {
          success: false,
          error: 'Email ou mot de passe incorrect'
        }
      }

      // Update last login
      await Database.updateLastLogin(user.id)

      // Create session
      const userSession: UserSession = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department
      }

      await createSession(userSession)

      return {
        success: true,
        data: userSession,
        message: 'Connexion réussie'
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: 'Erreur serveur. Veuillez réessayer.'
      }
    }
  }

  static async register(registerData: RegisterData): Promise<ApiResponse<UserSession>> {
    try {
      // Validate input
      const validation = validateRegisterData(registerData)
      if (!validation.valid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        }
      }

      // Hash password
      const hashedPassword = await hashPassword(registerData.password)

      // Create user
      const newUser = await Database.createUser({
        email: registerData.email,
        password: hashedPassword,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        role: 'employee', // Default role
        department: registerData.department,
        isActive: true,
        lastLogin: null
      })

      // Create session
      const userSession: UserSession = {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        department: newUser.department
      }

      await createSession(userSession)

      return {
        success: true,
        data: userSession,
        message: 'Compte créé avec succès'
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      
      if (error.message.includes('existe déjà')) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: false,
        error: 'Erreur lors de la création du compte. Veuillez réessayer.'
      }
    }
  }

  static async logout(): Promise<ApiResponse> {
    try {
      await destroySession()
      return {
        success: true,
        message: 'Déconnexion réussie'
      }
    } catch (error) {
      console.error('Logout error:', error)
      return {
        success: false,
        error: 'Erreur lors de la déconnexion'
      }
    }
  }

  static async hasPermission(userRole: string, permission: string): Promise<boolean> {
    try {
      const permissions = await Database.getRolePermissions(userRole)
      return permissions.includes('*') || permissions.includes(permission)
    } catch (error) {
      console.error('Permission check error:', error)
      return false
    }
  }
}