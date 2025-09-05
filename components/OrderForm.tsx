'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, Home, Building2, Hammer, User, Mail, Phone, MessageSquare, Sparkles } from 'lucide-react'
import { OrderFormData } from '@/types'
import { calculatePrice } from '@/lib/utils'

export default function OrderForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<OrderFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    cleaning_type: 'podstawowe',
    square_meters: 50,
    preferred_date: '',
    additional_notes: ''
  })

  const cleaningTypes = [
    {
      value: 'podstawowe',
      label: 'Sprzątanie podstawowe',
      icon: Home,
      description: 'Standardowe sprzątanie mieszkań i domów'
    },
    {
      value: 'głębokie',
      label: 'Sprzątanie głębokie',
      icon: Sparkles,
      description: 'Dokładne sprzątanie z detalami'
    },
    {
      value: 'biurowe',
      label: 'Sprzątanie biurowe',
      icon: Building2,
      description: 'Profesjonalne utrzymanie czystości biur'
    },
    {
      value: 'po_remoncie',
      label: 'Sprzątanie po remoncie',
      icon: Hammer,
      description: 'Specjalistyczne sprzątanie po pracach budowlanych'
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }))
  }

  const handleCleaningTypeChange = (type: 'podstawowe' | 'głębokie' | 'biurowe' | 'po_remoncie') => {
    setFormData(prev => ({
      ...prev,
      cleaning_type: type
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        // Redirect to tracking page with the tracking ID
        router.push(`/track/${result.tracking_id}`)
      } else {
        throw new Error('Failed to submit order')
      }
    } catch (error) {
      console.error('Error submitting order:', error)
      alert('Wystąpił błąd podczas wysyłania zgłoszenia. Spróbuj ponownie.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get minimum date (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Zamów sprzątanie
        </h1>
        <p className="text-lg text-gray-600">
          Wypełnij formularz, a my skontaktujemy się z Tobą w ciągu 24 godzin z ofertą
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 space-y-8">
        {/* Personal Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <User className="mr-2 h-5 w-5 text-primary-600" />
            Dane osobowe
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="form-label">
                Imię *
              </label>
              <input
                type="text"
                id="firstName"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="Jan"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="form-label">
                Nazwisko *
              </label>
              <input
                type="text"
                id="lastName"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="Kowalski"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="form-label">
                <Mail className="inline mr-1 h-4 w-4" />
                E-mail *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="jan@example.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="form-label">
                <Phone className="inline mr-1 h-4 w-4" />
                Telefon *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="+48 880 118 995"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="form-label">
              <MapPin className="inline mr-1 h-4 w-4" />
              Adres *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="form-input"
              placeholder="ul. Przykładowa 123, 34-300 Żywiec"
            />
          </div>
        </div>

        {/* Service Details */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Szczegóły usługi
          </h2>

          {/* Cleaning Type Selection */}
          <div>
            <label className="form-label">Typ sprzątania *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {cleaningTypes.map((type) => {
                const IconComponent = type.icon
                return (
                  <div
                    key={type.value}
                    className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                      formData.cleaning_type === type.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, cleaning_type: type.value as 'podstawowe' | 'głębokie' | 'biurowe' | 'po_remoncie' }))}
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      <IconComponent className={`h-8 w-8 ${
                        formData.cleaning_type === type.value ? 'text-primary-600' : 'text-gray-400'
                      }`} />
                      <h3 className={`font-medium ${
                        formData.cleaning_type === type.value ? 'text-primary-900' : 'text-gray-900'
                      }`}>
                        {type.label}
                      </h3>
                      <p className="text-sm text-gray-500">{type.description}</p>
                      <div className={`text-lg font-bold ${
                        formData.cleaning_type === type.value ? 'text-primary-600' : 'text-gray-600'
                      }`}>
                        od {calculatePrice(type.value, 50)} zł
                      </div>
                    </div>
                    {formData.cleaning_type === type.value && (
                      <div className="absolute top-2 right-2">
                        <div className="h-4 w-4 rounded-full bg-primary-500 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-white"></div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="squareMeters" className="form-label">
                Metraż (m²) *
              </label>
              <input
                type="number"
                id="squareMeters"
                name="square_meters"
                value={formData.square_meters}
                onChange={handleInputChange}
                required
                min="10"
                max="1000"
                className="form-input"
                placeholder="50"
              />
            </div>
            <div>
              <label htmlFor="preferredDate" className="form-label">
                <Calendar className="inline mr-1 h-4 w-4" />
                Preferowany termin *
              </label>
              <input
                type="date"
                id="preferredDate"
                name="preferred_date"
                value={formData.preferred_date}
                onChange={handleInputChange}
                required
                min={minDate}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label htmlFor="additionalNotes" className="form-label">
              <MessageSquare className="inline mr-1 h-4 w-4" />
              Dodatkowe uwagi
            </label>
            <textarea
              id="additionalNotes"
              name="additional_notes"
              value={formData.additional_notes}
              onChange={handleInputChange}
              rows={4}
              className="form-input resize-none"
              placeholder="Opisz dodatkowe wymagania, dostęp do mieszkania, itp..."
            />
          </div>
        </div>

        {/* Price Estimate */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Szacunkowa cena
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">
              {cleaningTypes.find(t => t.value === formData.cleaning_type)?.label} • {formData.square_meters}m²
            </span>
            <span className="text-2xl font-bold text-primary-600">
              {calculatePrice(formData.cleaning_type, formData.square_meters)} zł
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            * Ostateczna cena może się różnić w zależności od stanu obiektu i dodatkowych usług
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg py-4"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              'Wyślij zgłoszenie'
            )}
          </button>
          <p className="text-sm text-gray-500 text-center mt-3">
            Po wysłaniu zgłoszenia otrzymasz link do śledzenia statusu zlecenia
          </p>
        </div>
      </form>
    </div>
  )
}
