import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionFromToken } from './lib/auth/session'

// Routes qui ne nécessitent pas d'authentification
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/api/auth/login',
  '/api/auth/register',
  '/api/departments'
]

// Routes d'API qui nécessitent une authentification
const protectedApiRoutes = [
  '/api/auth/me',
  '/api/auth/logout',
  '/api/users'
]

// Routes des pages qui nécessitent une authentification
const protectedPageRoutes = [
  '/dashboard',
  '/admin',
  '/manager',
  '/hr',
  '/employee'
]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Vérifier si la route est publique
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Vérifier si la route nécessite une authentification
  const isProtectedRoute = 
    protectedApiRoutes.some(route => pathname.startsWith(route)) ||
    protectedPageRoutes.some(route => pathname.startsWith(route))

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Récupérer le token de session
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    // Rediriger vers login pour les pages, retourner 401 pour les API
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Vérifier la validité du token
  try {
    const session = await getSessionFromToken(token)
    
    if (!session) {
      throw new Error('Session invalide')
    }


    // Ajouter les informations de session aux headers pour les API routes
    if (pathname.startsWith('/api/')) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', session.id)
      requestHeaders.set('x-user-role', session.role)
      requestHeaders.set('x-user-email', session.email)

      return NextResponse.next({
        request: {
          headers: requestHeaders
        }
      })
    }

    // Vérification des permissions par rôle pour les pages
    if (pathname === '/dashboard') {
      if (!['admin', 'manager', 'hr'].includes(session.role)) {
        return NextResponse.redirect(new URL('/employee/dashboard', request.url))
      }
    }

    if (pathname.startsWith('/admin') && session.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (pathname.startsWith('/hr') && !['hr', 'admin'].includes(session.role)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (pathname.startsWith('/manager') && !['manager', 'admin'].includes(session.role)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (pathname.startsWith('/employee')) {
      if (!['employee', 'admin', 'manager', 'hr'].includes(session.role)) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    return NextResponse.next()

  } catch (error) {
    console.error('Middleware auth error:', error)
    
    // Token invalide - rediriger vers login ou retourner 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, error: 'Session expirée' },
        { status: 401 }
      )
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}