import { promises as fs } from 'fs'
import path from 'path'
import { User, Role, Department } from '../types'

const DATA_DIR = path.join(process.cwd(), 'data')

export class Database {
  private static async readFile(filename: string): Promise<any> {
    try {
      const filePath = path.join(DATA_DIR, filename)
      const fileContent = await fs.readFile(filePath, 'utf-8')
      return JSON.parse(fileContent)
    } catch (error) {
      console.error(`Error reading ${filename}:`, error)
      throw new Error(`Cannot read ${filename}`)
    }
  }

  private static async writeFile(filename: string, data: any): Promise<void> {
    try {
      const filePath = path.join(DATA_DIR, filename)
      await fs.writeFile(filePath, JSON.stringify(data, null, 2))
    } catch (error) {
      console.error(`Error writing ${filename}:`, error)
      throw new Error(`Cannot write ${filename}`)
    }
  }

  static async getUsers(): Promise<User[]> {
    const data = await this.readFile('users.json')
    return data.users
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.getUsers()
    return users.find(user => user.email === email) || null
  }

  static async getUserById(id: string): Promise<User | null> {
    const users = await this.getUsers()
    return users.find(user => user.id === id) || null
  }

  static async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const users = await this.getUsers()
    
    // Check if user already exists
    if (users.some(user => user.email === userData.email)) {
      throw new Error('Un utilisateur avec cet email existe déjà')
    }

    const newUser: User = {
      ...userData,
      id: `usr_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    await this.writeFile('users.json', { users })
    
    return newUser
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const users = await this.getUsers()
    const userIndex = users.findIndex(user => user.id === id)
    
    if (userIndex === -1) {
      throw new Error('Utilisateur non trouvé')
    }

    users[userIndex] = { ...users[userIndex], ...updates }
    await this.writeFile('users.json', { users })
    
    return users[userIndex]
  }

  static async updateLastLogin(userId: string): Promise<void> {
    await this.updateUser(userId, { lastLogin: new Date().toISOString() })
  }

  static async getRoles(): Promise<Record<string, Role>> {
    const data = await this.readFile('roles.json')
    return data.roles
  }

  static async getDepartments(): Promise<Department[]> {
    const data = await this.readFile('departments.json')
    return data.departments
  }

  static async getRolePermissions(role: string): Promise<string[]> {
    const roles = await this.getRoles()
    return roles[role]?.permissions || []
  }
}