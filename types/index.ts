export interface CleaningOrder {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  street: string
  house_number: string
  postal_code: string
  city: string
  // Legacy field for backward compatibility
  address?: string
  cleaning_type: 'podstawowe' | 'głębokie' | 'biurowe' | 'po_remoncie'
  square_meters: number
  preferred_date: string
  additional_notes?: string
  status: 'przyjęte' | 'w_trakcie' | 'zakończone'
  tracking_id: string
  admin_notes?: string
  estimated_price?: number
  final_price?: number
  additional_services?: AdditionalService[]
  service_details?: OrderServiceDetails
  created_at: string
  updated_at: string
}

export interface AdditionalService {
  id: string
  name: string
  price: number
  quantity?: number
}

export interface OrderServiceDetails {
  service_type: string
  service_name: string
  base_price: number
  additional_services_total: number
  eco_surcharge?: number
  total_calculated: number | string
}

export interface OrderFormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  street: string
  house_number: string
  postal_code: string
  city: string
  cleaning_type: 'podstawowe' | 'głębokie' | 'biurowe' | 'po_remoncie'
  square_meters: number
  preferred_date: string
  additional_notes?: string
  calculator_data?: {
    service_type: string
    service_name: string
    area: number
    additional_services: AdditionalService[]
    total_price: number | string
    timestamp: number
  }
}

export interface AdminUser {
  id: string
  email: string
  created_at: string
}

export interface ServiceType {
  id: string
  name: string
  description: string
  price_from: number
  icon: string
}

export interface Testimonial {
  id: string
  name: string
  rating: number
  comment: string
  date: string
}
