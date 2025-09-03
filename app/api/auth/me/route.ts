import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '../../../../lib/auth/session'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Non authentifié' 
        }, 
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      data: session
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur serveur interne' 
      }, 
      { status: 500 }
    )
  }
}