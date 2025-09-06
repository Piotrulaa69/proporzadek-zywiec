'use client'

import { useState, useEffect } from 'react'
import { CleaningOrder } from '@/types'
import { 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Edit3, 
  Eye, 
  Calendar,
  MapPin,
  Phone,
  User,
  LogOut,
  RefreshCw
} from 'lucide-react'

interface AdminDashboardProps {
  onLogout: () => void
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [orders, setOrders] = useState<CleaningOrder[]>([])
  const [filteredOrders, setFilteredOrders] = useState<CleaningOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<CleaningOrder | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(order => {
        // Utwórz pełny adres z nowych pól lub użyj starego pola
        const fullAddress = order.street && order.house_number && order.postal_code && order.city
          ? `${order.street} ${order.house_number} ${order.postal_code} ${order.city}`
          : order.address || ''
        
        return order.first_name.toLowerCase().includes(term) ||
               order.last_name.toLowerCase().includes(term) ||
               order.email.toLowerCase().includes(term) ||
               order.phone.includes(term) ||
               fullAddress.toLowerCase().includes(term)
      })
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = async (orderId: string, newStatus: string, adminNotes?: string) => {
    setIsUpdatingStatus(true)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, admin_notes: adminNotes }),
      })

      if (response.ok) {
        await fetchOrders()
        setShowOrderModal(false)
        setSelectedOrder(null)
      }
    } catch (error) {
      console.error('Error updating order:', error)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const sendQuotePDF = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/send-quote`, {
        method: 'POST',
      })

      if (response.ok) {
        alert('Oferta PDF została wysłana do klienta!')
      } else {
        alert('Wystąpił błąd podczas wysyłania oferty.')
      }
    } catch (error) {
      console.error('Error sending quote:', error)
      alert('Wystąpił błąd podczas wysyłania oferty.')
    }
  }

  const exportToCSV = () => {
    const csvContent = [
      ['ID', 'Imię', 'Nazwisko', 'E-mail', 'Telefon', 'Adres', 'Typ sprzątania', 'Metraż', 'Termin', 'Status', 'Data utworzenia'],
      ...filteredOrders.map(order => [
        order.tracking_id,
        order.first_name,
        order.last_name,
        order.email,
        order.phone,
        order.address,
        order.cleaning_type,
        order.square_meters.toString(),
        order.preferred_date,
        order.status,
        new Date(order.created_at).toLocaleDateString('pl-PL')
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `zlecenia_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'przyjęte': { color: 'bg-yellow-100 text-yellow-800', label: 'Przyjęte' },
      'w_trakcie': { color: 'bg-blue-100 text-blue-800', label: 'W trakcie' },
      'zakończone': { color: 'bg-green-100 text-green-800', label: 'Zakończone' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { color: 'bg-gray-100 text-gray-800', label: status }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getCleaningTypeLabel = (type: string) => {
    const types = {
      'mieszkanie': 'Mieszkanie',
      'biuro': 'Biuro',
      'po_remoncie': 'Po remoncie'
    }
    return types[type as keyof typeof types] || type
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel administratora</h1>
              <p className="text-gray-600">ProPorządek Żywiec</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchOrders}
                className="btn-secondary flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Odśwież
              </button>
              <button
                onClick={onLogout}
                className="btn-primary flex items-center"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Wyloguj
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
            <div className="text-gray-600">Wszystkie zlecenia</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'przyjęte').length}
            </div>
            <div className="text-gray-600">Przyjęte</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'w_trakcie').length}
            </div>
            <div className="text-gray-600">W trakcie</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'zakończone').length}
            </div>
            <div className="text-gray-600">Zakończone</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Szukaj po imieniu, nazwisku, e-mailu, telefonie lub adresie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Wszystkie statusy</option>
                  <option value="przyjęte">Przyjęte</option>
                  <option value="w_trakcie">W trakcie</option>
                  <option value="zakończone">Zakończone</option>
                </select>
                <button
                  onClick={exportToCSV}
                  className="btn-secondary flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Eksportuj CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Klient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kontakt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usługa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Termin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {order.first_name} {order.last_name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {(() => {
                              const displayAddress = order.street && order.house_number && order.postal_code && order.city
                                ? `${order.street} ${order.house_number}, ${order.postal_code} ${order.city}`
                                : order.address || 'Brak adresu'
                              return displayAddress.length > 30 ? displayAddress.substring(0, 30) + '...' : displayAddress
                            })()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.email}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {order.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getCleaningTypeLabel(order.cleaning_type)}
                      </div>
                      <div className="text-sm text-gray-500">{order.square_meters} m²</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(order.preferred_date).toLocaleDateString('pl-PL')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowOrderModal(true)
                          }}
                          className="text-primary-600 hover:text-primary-900"
                          title="Szczegóły i edycja"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => sendQuotePDF(order.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Wyślij ofertę PDF"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                        <a
                          href={`/track/${order.tracking_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-900"
                          title="Zobacz panel klienta"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">Brak zleceń spełniających kryteria wyszukiwania</div>
            </div>
          )}
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => {
            setShowOrderModal(false)
            setSelectedOrder(null)
          }}
          onUpdateStatus={updateOrderStatus}
          isUpdating={isUpdatingStatus}
        />
      )}
    </div>
  )
}

// Order Modal Component
interface OrderModalProps {
  order: CleaningOrder
  onClose: () => void
  onUpdateStatus: (orderId: string, status: string, adminNotes?: string) => void
  isUpdating: boolean
}

function OrderModal({ order, onClose, onUpdateStatus, isUpdating }: OrderModalProps) {
  const [newStatus, setNewStatus] = useState(order.status)
  const [adminNotes, setAdminNotes] = useState(order.admin_notes || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateStatus(order.id, newStatus, adminNotes)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Szczegóły zlecenia
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Dane klienta</h3>
                <div className="space-y-1 text-sm">
                  <div><strong>Imię i nazwisko:</strong> {order.first_name} {order.last_name}</div>
                  <div><strong>E-mail:</strong> {order.email}</div>
                  <div><strong>Telefon:</strong> {order.phone}</div>
                  <div><strong>Adres:</strong> {
                    order.street && order.house_number && order.postal_code && order.city
                      ? `${order.street} ${order.house_number}, ${order.postal_code} ${order.city}`
                      : order.address || 'Brak adresu'
                  }</div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Szczegóły usługi</h3>
                <div className="space-y-1 text-sm">
                  <div><strong>Typ:</strong> {order.cleaning_type}</div>
                  <div><strong>Metraż:</strong> {order.square_meters} m²</div>
                  <div><strong>Termin:</strong> {new Date(order.preferred_date).toLocaleDateString('pl-PL')}</div>
                  <div><strong>ID śledzenia:</strong> {order.tracking_id}</div>
                </div>
              </div>
            </div>

            {/* Szczegóły kalkulatora */}
            {order.service_details && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Szczegóły wyceny z kalkulatora</h3>
                <div className="bg-blue-50 p-3 rounded space-y-2 text-sm">
                  <div><strong>Usługa:</strong> {order.service_details.service_name}</div>
                  <div><strong>Cena bazowa:</strong> {order.service_details.base_price} zł</div>
                  {order.service_details.additional_services_total > 0 && (
                    <div><strong>Usługi dodatkowe:</strong> +{order.service_details.additional_services_total} zł</div>
                  )}
                  {order.service_details.eco_surcharge && (
                    <div><strong>Dopłata ekologiczna:</strong> +{order.service_details.eco_surcharge} zł</div>
                  )}
                  <div className="border-t pt-2 font-medium">
                    <strong>Razem z kalkulatora:</strong> {typeof order.service_details.total_calculated === 'string' 
                      ? order.service_details.total_calculated 
                      : `${order.service_details.total_calculated} zł`
                    }
                  </div>
                </div>
              </div>
            )}
            
            {/* Usługi dodatkowe */}
            {order.additional_services && order.additional_services.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Wybrane usługi dodatkowe</h3>
                <div className="bg-gray-50 p-3 rounded">
                  <ul className="text-sm space-y-1">
                    {order.additional_services.map((service, index) => (
                      <li key={index} className="flex justify-between">
                        <div className="flex items-center space-x-2">
                          <span>{service.name}</span>
                          {service.quantity && service.quantity > 1 && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                              x{service.quantity}
                            </span>
                          )}
                        </div>
                        <span>
                          {service.id === 'eco' ? '+9%' : 
                           service.quantity && service.quantity > 1 ? 
                           `+${service.price * service.quantity} zł` : 
                           `+${service.price} zł`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {order.additional_notes && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Uwagi klienta</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{order.additional_notes}</p>
              </div>
            )}

            {/* Status Update Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Status zlecenia</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as 'przyjęte' | 'w_trakcie' | 'zakończone')}
                  className="form-input"
                >
                  <option value="przyjęte">Przyjęte</option>
                  <option value="w_trakcie">W trakcie</option>
                  <option value="zakończone">Zakończone</option>
                </select>
              </div>

              <div>
                <label className="form-label">Notatki administratora</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="form-input resize-none"
                  placeholder="Dodaj notatki widoczne dla klienta..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn-primary disabled:opacity-50"
                >
                  {isUpdating ? 'Zapisywanie...' : 'Zapisz zmiany'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
