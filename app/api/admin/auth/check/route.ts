import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('admin_token')

    if (!token) {
      return NextResponse.json(
        { error: 'Brak tokenu autoryzacji' },
        { status: 401 }
      )
    }

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      return NextResponse.json(
        { error: 'Błąd konfiguracji serwera' },
        { status: 500 }
      )
    }

    try {
      const decoded = jwt.verify(token.value, jwtSecret) as any
      
      if (decoded.role !== 'admin') {
        return NextResponse.json(
          { error: 'Brak uprawnień administratora' },
          { status: 403 }
        )
      }

      return NextResponse.json({ 
        success: true, 
        admin: { email: decoded.email } 
      })

    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Nieprawidłowy token autoryzacji' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}
