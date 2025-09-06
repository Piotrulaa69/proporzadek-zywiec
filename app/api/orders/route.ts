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
        !body.street || !body.house_number || !body.postal_code || !body.city ||
        !body.cleaning_type || !body.square_meters || !body.preferred_date) {
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

    // Calculate estimated price (użyj danych z kalkulatora jeśli dostępne)
    let estimatedPrice = calculatePrice(body.cleaning_type, body.square_meters)
    let additionalServices = null
    let serviceDetails = null
    
    // Mapowanie typów usług z kalkulatora na wartości w bazie
    const mapServiceType = (calcType: string): 'podstawowe' | 'głębokie' | 'biurowe' | 'po_remoncie' => {
      switch (calcType) {
        case 'residential': return 'podstawowe'
        case 'office': return 'biurowe'
        case 'post_renovation': return 'po_remoncie'
        case 'upholstery': return 'podstawowe' // Tapicerka jako podstawowe
        default: return 'podstawowe'
      }
    }

    // Jeśli są dane z kalkulatora, użyj ich
    if (body.calculator_data) {
      const calcData = body.calculator_data
      estimatedPrice = typeof calcData.total_price === 'number' ? calcData.total_price : 0
      
      additionalServices = calcData.additional_services || []
      
      // Zmapuj typ usługi na wartość akceptowaną przez bazę
      body.cleaning_type = mapServiceType(calcData.service_type)
      
      // Oblicz cenę bazową na podstawie typu usługi i metrażu
      let basePrice = 0
      if (calcData.service_type === 'residential_onetime') {
        if (calcData.area <= 30) basePrice = 249
        else if (calcData.area <= 40) basePrice = 259
        else if (calcData.area <= 50) basePrice = 269
        else if (calcData.area <= 60) basePrice = 289
        else if (calcData.area <= 70) basePrice = 299
        else if (calcData.area <= 80) basePrice = 379
        else if (calcData.area <= 90) basePrice = 399
        else if (calcData.area <= 100) basePrice = 429
        else if (calcData.area <= 120) basePrice = 499
      } else if (calcData.service_type === 'residential_weekly') {
        if (calcData.area <= 30) basePrice = 219
        else if (calcData.area <= 40) basePrice = 229
        else if (calcData.area <= 50) basePrice = 239
        else if (calcData.area <= 60) basePrice = 249
        else if (calcData.area <= 70) basePrice = 269
        else if (calcData.area <= 80) basePrice = 299
        else if (calcData.area <= 90) basePrice = 329
        else if (calcData.area <= 100) basePrice = 379
        else if (calcData.area <= 120) basePrice = 459
      } else if (calcData.service_type === 'residential_biweekly') {
        if (calcData.area <= 30) basePrice = 229
        else if (calcData.area <= 40) basePrice = 239
        else if (calcData.area <= 50) basePrice = 249
        else if (calcData.area <= 60) basePrice = 259
        else if (calcData.area <= 70) basePrice = 279
        else if (calcData.area <= 80) basePrice = 309
        else if (calcData.area <= 90) basePrice = 349
        else if (calcData.area <= 100) basePrice = 389
        else if (calcData.area <= 120) basePrice = 479
      } else if (calcData.service_type === 'office') {
        if (calcData.area <= 50) basePrice = 199
        else if (calcData.area <= 100) basePrice = 249
      } else if (calcData.service_type === 'upholstery') {
        basePrice = 200
      }
      
      // Oblicz sumę usług dodatkowych (z ilościami, bez eco)
      const additionalServicesTotal = calcData.additional_services?.reduce((sum: number, service: any) => {
        if (service.id === 'eco') return sum // Eco jest GRATIS
        return sum + (service.price * (service.quantity || 1))
      }, 0) || 0

      serviceDetails = {
        service_type: calcData.service_type,
        service_name: calcData.service_name,
        base_price: basePrice,
        additional_services_total: additionalServicesTotal,
        eco_surcharge: undefined, // Eco jest GRATIS
        total_calculated: calcData.total_price
      }
    }

    // Sanitize inputs - now using separate address fields
    const fullAddress = `${sanitizeInput(body.street)} ${sanitizeInput(body.house_number)}, ${sanitizeInput(body.postal_code)} ${sanitizeInput(body.city)}`
    
    const sanitizedData = {
      first_name: sanitizeInput(body.first_name),
      last_name: sanitizeInput(body.last_name),
      email: body.email.toLowerCase().trim(),
      phone: body.phone.trim(),
      street: sanitizeInput(body.street),
      house_number: sanitizeInput(body.house_number),
      postal_code: sanitizeInput(body.postal_code),
      city: sanitizeInput(body.city),
      // Keep legacy field for backward compatibility
      address: fullAddress,
      cleaning_type: body.cleaning_type,
      square_meters: body.square_meters,
      preferred_date: body.preferred_date,
      additional_notes: body.additional_notes ? sanitizeInput(body.additional_notes) : null,
      tracking_id: trackingId,
      status: 'przyjęte',
      estimated_price: estimatedPrice,
      additional_services: additionalServices,
      service_details: serviceDetails,
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
