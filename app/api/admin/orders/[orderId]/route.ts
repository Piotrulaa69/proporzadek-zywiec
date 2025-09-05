import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { supabaseAdmin } from '@/lib/supabase'

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

export async function PATCH(
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
    const body = await request.json()

    // Validate input
    if (!orderId) {
      return NextResponse.json(
        { error: 'Brak ID zlecenia' },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (body.status) {
      const validStatuses = ['przyjęte', 'w_trakcie', 'zakończone']
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: 'Nieprawidłowy status' },
          { status: 400 }
        )
      }
      updateData.status = body.status
    }

    if (body.admin_notes !== undefined) {
      updateData.admin_notes = body.admin_notes || null
    }

    if (body.final_price !== undefined) {
      updateData.final_price = parseFloat(body.final_price) || null
    }

    // Update order in database
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Błąd aktualizacji zlecenia' },
        { status: 500 }
      )
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Nie znaleziono zlecenia' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}

export async function GET(
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

    return NextResponse.json(order)

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}
