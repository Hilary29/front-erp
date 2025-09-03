import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '../../../../lib/auth/auth'

export async function POST(request: NextRequest) {
  try {
    const result = await AuthService.logout()
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Logout API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur serveur interne' 
      }, 
      { status: 500 }
    )
  }
}