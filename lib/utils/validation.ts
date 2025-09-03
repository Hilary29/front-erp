import { LoginCredentials, RegisterData } from '../types'

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins 8 caractères' }
  }
  
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return { 
      valid: false, 
      message: 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre' 
    }
  }
  
  return { valid: true }
}

export function validateLoginData(data: LoginCredentials): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!data.email || !validateEmail(data.email)) {
    errors.push('Email invalide')
  }
  
  if (!data.password) {
    errors.push('Mot de passe requis')
  }
  
  return { valid: errors.length === 0, errors }
}

export function validateRegisterData(data: RegisterData): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!data.firstName || data.firstName.length < 2) {
    errors.push('Le prénom doit contenir au moins 2 caractères')
  }
  
  if (!data.lastName || data.lastName.length < 2) {
    errors.push('Le nom doit contenir au moins 2 caractères')
  }
  
  if (!data.email || !validateEmail(data.email)) {
    errors.push('Email invalide')
  }
  
  const passwordCheck = validatePassword(data.password)
  if (!passwordCheck.valid) {
    errors.push(passwordCheck.message!)
  }
  
  if (!data.department) {
    errors.push('Département requis')
  }
  
  return { valid: errors.length === 0, errors }
}