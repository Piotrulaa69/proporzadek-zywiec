export interface CleaningOrder {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  cleaning_type: 'podstawowe' | 'głębokie' | 'biurowe' | 'po_remoncie'
  square_meters: number
  preferred_date: string
  additional_notes?: string
  status: 'przyjęte' | 'w_trakcie' | 'zakończone'
  tracking_id: string
  admin_notes?: string
  created_at: string
  updated_at: string
}

export interface OrderFormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  cleaning_type: 'podstawowe' | 'głębokie' | 'biurowe' | 'po_remoncie'
  square_meters: number
  preferred_date: string
  additional_notes?: string
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
