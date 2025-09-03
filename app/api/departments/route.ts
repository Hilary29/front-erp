import { NextRequest, NextResponse } from 'next/server'
import { Database } from '../../../lib/auth/database'

export async function GET(request: NextRequest) {
  try {
    const departments = await Database.getDepartments()
    
    return NextResponse.json({
      success: true,
      data: departments
    })
  } catch (error) {
    console.error('Departments API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des départements' 
      }, 
      { status: 500 }
    )
  }
}