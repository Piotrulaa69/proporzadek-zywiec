import { v4 as uuidv4 } from 'uuid'

export function generateTrackingId(): string {
  return uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase()
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  // Sprawdza format +48 XXX XXX XXX (9 cyfr po +48 z opcjonalnymi spacjami)
  const phoneRegex = /^\+48 \d{3}( \d{3})?( \d{3})?$/
  // Sprawdź też czy ma dokładnie 9 cyfr
  const digitsOnly = phone.replace(/\D/g, '')
  return phoneRegex.test(phone) && digitsOnly.length === 11 // 48 + 9 cyfr
}

export function calculatePrice(cleaningType: string, squareMeters: number): number {
  // Sprzątanie po remoncie - wycena indywidualna
  if (cleaningType === 'po_remoncie') {
    return 0 // Wycena indywidualna
  }
  
  // Cennik dla sprzątania mieszkań
  if (cleaningType === 'podstawowe' || cleaningType === 'głębokie') {
    if (squareMeters <= 30) return 249
    else if (squareMeters <= 40) return 259
    else if (squareMeters <= 50) return 269
    else if (squareMeters <= 60) return 289
    else if (squareMeters <= 70) return 299
    else if (squareMeters <= 80) return 379
    else if (squareMeters <= 90) return 399
    else if (squareMeters <= 100) return 429
    else if (squareMeters <= 120) return 499
    else return 0 // Wycena indywidualna dla powyżej 120m²
  }
  
  // Cennik dla sprzątania biur
  if (cleaningType === 'biurowe') {
    if (squareMeters <= 50) return 239
    else if (squareMeters <= 100) return 269
    else return 0 // Wycena indywidualna dla powyżej 100m²
  }
  
  return 249 // Domyślna cena
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}
