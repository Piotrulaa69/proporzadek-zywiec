'use client'

import { useState, useEffect } from 'react'
import { CleaningOrder } from '@/types'
import { CheckCircle, Clock, Play, MapPin, Calendar, Phone, Mail, MessageSquare } from 'lucide-react'

interface TrackingPanelProps {
  trackingId: string
}

export default function TrackingPanel({ trackingId }: TrackingPanelProps) {
  const [order, setOrder] = useState<CleaningOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOrderData()
  }, [trackingId])

  const fetchOrderData = async () => {
    try {
      const response = await fetch(`/api/track/${trackingId}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      } else if (response.status === 404) {
        setError('Nie znaleziono zlecenia o podanym identyfikatorze.')
      } else {
        setError('Wystąpił błąd podczas pobierania danych.')
      }
    } catch (error) {
      setError('Wystąpił błąd podczas pobierania danych.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'przyjęte':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          title: 'Zlecenie przyjęte',
          description: 'Twoje zgłoszenie zostało przyjęte i jest przetwarzane przez nasz zespół.'
        }
      case 'w_trakcie':
        return {
          icon: Play,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          title: 'W trakcie realizacji',
          description: 'Nasz zespół pracuje nad Twoim zleceniem.'
        }
      case 'zakończone':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          title: 'Zlecenie zakończone',
          description: 'Sprzątanie zostało ukończone. Dziękujemy za zaufanie!'
        }
      default:
        return {
          icon: Clock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          title: 'Nieznany status',
          description: 'Status zlecenia jest nieznany.'
        }
    }
  }

  const getCleaningTypeLabel = (type: string) => {
    switch (type) {
      case 'mieszkanie':
        return 'Sprzątanie mieszkania'
      case 'biuro':
        return 'Sprzątanie biura'
      case 'po_remoncie':
        return 'Sprzątanie po remoncie'
      default:
        return type
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <div className="text-red-600 text-lg font-medium mb-2">Błąd</div>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
          <p className="text-gray-700">Nie znaleziono zlecenia.</p>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.status)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Śledzenie zlecenia
        </h1>
        <p className="text-lg text-gray-600">
          ID: <span className="font-mono font-medium">{trackingId}</span>
        </p>
      </div>

      {/* Status Card */}
      <div className="card p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className={`p-4 rounded-full ${statusInfo.bgColor}`}>
            <statusInfo.icon className={`h-8 w-8 ${statusInfo.color}`} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{statusInfo.title}</h2>
            <p className="text-gray-600">{statusInfo.description}</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {['przyjęte', 'w_trakcie', 'zakończone'].map((step, index) => {
            const isActive = step === order.status
            const isCompleted = ['w_trakcie', 'zakończone'].includes(order.status) && step === 'przyjęte' ||
                              order.status === 'zakończone' && step === 'w_trakcie'
            
            return (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-primary-600 text-white' :
                  isCompleted ? 'bg-green-600 text-white' :
                  'bg-gray-200 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < 2 && (
                  <div className={`w-16 h-1 mx-2 ${
                    isCompleted || (isActive && index === 0) ? 'bg-green-600' :
                    isActive && index === 1 ? 'bg-primary-600' :
                    'bg-gray-200'
                  }`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Admin Notes */}
        {order.admin_notes && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium text-blue-900">Notatka od firmy</h3>
            </div>
            <p className="text-blue-800">{order.admin_notes}</p>
          </div>
        )}
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Service Details */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Szczegóły usługi</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
              <span className="text-gray-600">Typ:</span>
              <span className="font-medium">{getCleaningTypeLabel(order.cleaning_type)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
              <span className="text-gray-600">Metraż:</span>
              <span className="font-medium">{order.square_meters} m²</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Preferowany termin:</span>
              <span className="font-medium">
                {new Date(order.preferred_date).toLocaleDateString('pl-PL')}
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
              <span className="text-gray-600">Adres:</span>
              <span className="font-medium">
                {order.street && order.house_number && order.postal_code && order.city
                  ? `${order.street} ${order.house_number}, ${order.postal_code} ${order.city}`
                  : order.address
                }
              </span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dane kontaktowe</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
              <span className="text-gray-600">Imię i nazwisko:</span>
              <span className="font-medium">{order.first_name} {order.last_name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">E-mail:</span>
              <span className="font-medium">{order.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Telefon:</span>
              <span className="font-medium">{order.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calculator Details */}
      {order.service_details && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Szczegóły wyceny</h3>
          <div className="bg-primary-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Usługa:</span>
              <span className="font-medium text-gray-900">{order.service_details.service_name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Cena bazowa:</span>
              <span className="font-medium text-gray-900">{order.service_details.base_price} zł</span>
            </div>
            {order.service_details.additional_services_total > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Usługi dodatkowe:</span>
                <span className="font-medium text-gray-900">+{order.service_details.additional_services_total} zł</span>
              </div>
            )}
            {order.service_details.eco_surcharge && (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Dopłata ekologiczna:</span>
                <span className="font-medium text-gray-900">+{order.service_details.eco_surcharge} zł</span>
              </div>
            )}
            <div className="border-t border-primary-200 pt-3 flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Razem:</span>
              <span className="text-2xl font-bold text-primary-600">
                {typeof order.service_details.total_calculated === 'string' 
                  ? order.service_details.total_calculated 
                  : `${order.service_details.total_calculated} zł`
                }
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Selected Additional Services */}
      {order.additional_services && order.additional_services.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Wybrane usługi dodatkowe</h3>
          <div className="space-y-2">
            {order.additional_services.map((service, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">{service.name}</span>
                  {service.quantity && service.quantity > 1 && (
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
                      x{service.quantity}
                    </span>
                  )}
                </div>
                <span className="font-medium text-gray-900">
                  {service.id === 'eco' ? 
                    <span className="text-green-600 font-semibold">GRATIS</span> : 
                   service.quantity && service.quantity > 1 ? 
                   `+${service.price * service.quantity} zł` : 
                   `+${service.price} zł`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Notes */}
      {order.additional_notes && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dodatkowe uwagi</h3>
          <p className="text-gray-600">{order.additional_notes}</p>
        </div>
      )}

      {/* Timeline */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Historia zlecenia</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
            <div>
              <div className="font-medium text-gray-900">Zlecenie utworzone</div>
              <div className="text-sm text-gray-500">{formatDate(order.created_at)}</div>
            </div>
          </div>
          {order.updated_at !== order.created_at && (
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <div>
                <div className="font-medium text-gray-900">Ostatnia aktualizacja</div>
                <div className="text-sm text-gray-500">{formatDate(order.updated_at)}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Masz pytania?</h3>
        <p className="text-gray-600 mb-4">
          Skontaktuj się z nami, jeśli potrzebujesz dodatkowych informacji o swoim zleceniu.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:+48880118995"
            className="btn-primary inline-flex items-center justify-center"
          >
            <Phone className="mr-2 h-4 w-4" />
            Zadzwoń
          </a>
          <a
            href="mailto:proporzadekzywiec@gmail.com"
            className="btn-secondary inline-flex items-center justify-center"
          >
            <Mail className="mr-2 h-4 w-4" />
            Napisz e-mail
          </a>
        </div>
      </div>
    </div>
  )
}
