import { NextRequest, NextResponse } from 'next/server'
import { sendContactForm } from '@/lib/email'
import { validateEmail, sanitizeInput } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
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

    // Validate message length
    if (body.message.length < 10) {
      return NextResponse.json(
        { error: 'Wiadomość musi mieć co najmniej 10 znaków' },
        { status: 400 }
      )
    }

    if (body.message.length > 2000) {
      return NextResponse.json(
        { error: 'Wiadomość nie może przekraczać 2000 znaków' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(body.name),
      email: body.email.toLowerCase().trim(),
      phone: body.phone ? sanitizeInput(body.phone) : undefined,
      subject: body.subject ? sanitizeInput(body.subject) : undefined,
      message: sanitizeInput(body.message)
    }

    // Send contact form email
    try {
      await sendContactForm(sanitizedData)

      return NextResponse.json({
        success: true,
        message: 'Wiadomość została wysłana pomyślnie'
      })

    } catch (emailError) {
      console.error('Email error:', emailError)
      return NextResponse.json(
        { error: 'Błąd wysyłania wiadomości' },
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
