import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendOrderConfirmation } from '@/lib/email'
import { generateTrackingId, validateEmail, validatePhone, sanitizeInput, calculatePrice } from '@/lib/utils'
import { OrderFormData } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: OrderFormData = await request.json()

    // Validate required fields
    if (!body.first_name || !body.last_name || !body.email || !body.phone || 
        !body.address || !body.cleaning_type || !body.square_meters || !body.preferred_date) {
      return NextResponse.json(
        { error: 'Wszystkie wymagane pola muszą być wypełnione' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!validateEmail(body.email)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy format adresu e-mail' },
        { status: 400 }
      )
    }

    // Validate phone format
    if (!validatePhone(body.phone)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy format numeru telefonu' },
        { status: 400 }
      )
    }

    // Validate square meters
    if (body.square_meters < 1 || body.square_meters > 1000) {
      return NextResponse.json(
        { error: 'Metraż musi być między 1 a 1000 m²' },
        { status: 400 }
      )
    }

    // Validate preferred date (must be in the future)
    const preferredDate = new Date(body.preferred_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (preferredDate < today) {
      return NextResponse.json(
        { error: 'Data nie może być z przeszłości' },
        { status: 400 }
      )
    }

    // Generate tracking ID
    const trackingId = generateTrackingId()

    // Calculate estimated price
    const estimatedPrice = calculatePrice(body.cleaning_type, body.square_meters)

    // Sanitize inputs
    const sanitizedData = {
      first_name: sanitizeInput(body.first_name),
      last_name: sanitizeInput(body.last_name),
      email: body.email.toLowerCase().trim(),
      phone: body.phone.trim(),
      address: sanitizeInput(body.address),
      cleaning_type: body.cleaning_type,
      square_meters: body.square_meters,
      preferred_date: body.preferred_date,
      additional_notes: body.additional_notes ? sanitizeInput(body.additional_notes) : null,
      tracking_id: trackingId,
      status: 'przyjęte',
      estimated_price: estimatedPrice,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Check if supabaseAdmin is available
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      )
    }

    // Insert order into database
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .insert([sanitizedData])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Wystąpił błąd podczas zapisywania zlecenia' },
        { status: 500 }
      )
    }

    // Send confirmation email - TEMPORARILY DISABLED
    // try {
    //   await sendOrderConfirmation(order)
    // } catch (emailError) {
    //   console.error('Email error:', emailError)
    //   // Don't fail the request if email fails, but log it
    // }

    return NextResponse.json({
      success: true,
      tracking_id: trackingId,
      tracking_url: `/track/${trackingId}`,
      estimated_price: estimatedPrice
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}
