import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '../../../../lib/auth/auth'
import { LoginCredentials } from '../../../../lib/types'

export async function POST(request: NextRequest) {
  try {
    const body: LoginCredentials = await request.json()
    const result = await AuthService.login(body)

    if (result.success) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur serveur interne' 
      }, 
      { status: 500 }
    )
  }
}