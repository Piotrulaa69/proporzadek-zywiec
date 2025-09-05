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
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,}$/
  return phoneRegex.test(phone)
}

export function calculatePrice(cleaningType: string, squareMeters: number): number {
  let basePrice = 80
  
  switch (cleaningType) {
    case 'podstawowe':
      basePrice = 80
      break
    case 'głębokie':
      basePrice = 120
      break
    case 'biurowe':
      basePrice = 100
      break
    case 'po_remoncie':
      basePrice = 200
      break
    default:
      basePrice = 80
  }
  
  const pricePerSqm = cleaningType === 'po_remoncie' ? 3 : 2
  const additionalArea = Math.max(0, squareMeters - 50)
  
  return basePrice + (additionalArea * pricePerSqm)
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}
