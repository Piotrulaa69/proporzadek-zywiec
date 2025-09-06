import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { trackingId: string } }
) {
  try {
    const { trackingId } = params

    if (!trackingId) {
      return NextResponse.json(
        { error: 'Brak numeru śledzenia' },
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

    // Fetch order by tracking ID
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('tracking_id', trackingId)
      .single()

    if (error || !order) {
      return NextResponse.json(
        { error: 'Nie znaleziono zlecenia o podanym numerze śledzenia' },
        { status: 404 }
      )
    }

    // Return order data (excluding sensitive information)
    const orderData = {
      id: order.id,
      tracking_id: order.tracking_id,
      first_name: order.first_name,
      last_name: order.last_name,
      email: order.email,
      phone: order.phone,
      address: order.address,
      cleaning_type: order.cleaning_type,
      square_meters: order.square_meters,
      preferred_date: order.preferred_date,
      additional_notes: order.additional_notes,
      status: order.status,
      admin_notes: order.admin_notes,
      estimated_price: order.estimated_price,
      final_price: order.final_price,
      additional_services: order.additional_services,
      service_details: order.service_details,
      created_at: order.created_at,
      updated_at: order.updated_at
    }

    return NextResponse.json(orderData)

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}
