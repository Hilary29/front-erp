import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '../../../../lib/auth/auth'
import { RegisterData } from '../../../../lib/types'

export async function POST(request: NextRequest) {
  try {
    const body: RegisterData = await request.json()
    const result = await AuthService.register(body)

    if (result.success) {
      return NextResponse.json(result, { status: 201 })
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error('Register API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur serveur interne' 
      }, 
      { status: 500 }
    )
  }
}