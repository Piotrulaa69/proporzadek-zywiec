import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { supabaseAdmin } from '@/lib/supabase'
import { sendQuotePDF } from '@/lib/email'

async function verifyAdminAuth(): Promise<boolean> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('admin_token')

    if (!token) return false

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) return false

    const decoded = jwt.verify(token.value, jwtSecret) as any
    return decoded.role === 'admin'
  } catch {
    return false
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    // Verify admin authentication
    const isAuthenticated = await verifyAdminAuth()
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Brak autoryzacji' },
        { status: 401 }
      )
    }

    const { orderId } = params

    if (!orderId) {
      return NextResponse.json(
        { error: 'Brak ID zlecenia' },
        { status: 400 }
      )
    }

    // Check if supabaseAdmin is available
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      )
    }

    // Fetch order from database
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (error || !order) {
      return NextResponse.json(
        { error: 'Nie znaleziono zlecenia' },
        { status: 404 }
      )
    }

    // Send quote PDF email
    try {
      await sendQuotePDF(order)
      
      // Update order to mark that quote was sent
      await supabaseAdmin
        .from('orders')
        .update({ 
          quote_sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)

      return NextResponse.json({ 
        success: true, 
        message: 'Oferta PDF została wysłana' 
      })

    } catch (emailError) {
      console.error('Email error:', emailError)
      return NextResponse.json(
        { error: 'Błąd wysyłania e-maila' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}
