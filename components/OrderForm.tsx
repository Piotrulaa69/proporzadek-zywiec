'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, User, Mail, Phone, MessageSquare, ArrowLeft, CheckCircle, Calculator, Home, Building2, Hammer, Sparkles } from 'lucide-react'
import { OrderFormData } from '@/types'
import { generateTrackingId, sanitizeInput, validateEmail, validatePhone } from '@/lib/utils'

interface OrderCalculation {
  serviceType: string
  serviceName: string
  area: number
  additionalServices: Array<{
    id: string
    name: string
    price: number
    selected: boolean
    quantity: number
  }>
  totalPrice: number | string
  timestamp: number
}

export default function OrderForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderCalculation, setOrderCalculation] = useState<OrderCalculation | null>(null)
  const [showCalculator, setShowCalculator] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  
  // Stany dla mini-kalkulatora
  const [calcServiceType, setCalcServiceType] = useState('residential_weekly')
  const [calcArea, setCalcArea] = useState(50)
  const [calcAdditionals, setCalcAdditionals] = useState<Array<{id: string, name: string, price: number, selected: boolean, quantity: number}>>([    // Okna i drzwi
    { id: 'windows_1', name: 'Okno 1-skrzydłowe', price: 39, selected: false, quantity: 1 },
    { id: 'windows_2', name: 'Okno 2-skrzydłowe standardowe', price: 69, selected: false, quantity: 1 },
    { id: 'balcony_door_1', name: 'Drzwi balkonowe (1 skrzydło)', price: 49, selected: false, quantity: 1 },
    { id: 'balcony_door_2', name: 'Drzwi balkonowe (2 skrzydła)', price: 79, selected: false, quantity: 1 },
    { id: 'roof_window', name: 'Okno dachowe', price: 55, selected: false, quantity: 1 },
    { id: 'glass_balustrade', name: 'Balustrada szklana', price: 25, selected: false, quantity: 1 },
    
    // AGD kuchenne
    { id: 'fridge', name: 'Mycie lodówki', price: 75, selected: false, quantity: 1 },
    { id: 'microwave', name: 'Mycie mikrofalowki', price: 39, selected: false, quantity: 1 },
    { id: 'oven', name: 'Czyszczenie piekarnika', price: 75, selected: false, quantity: 1 },
    { id: 'dishwasher', name: 'Mycie zmywarki', price: 55, selected: false, quantity: 1 },
    { id: 'hood', name: 'Mycie okapu', price: 49, selected: false, quantity: 1 },
    { id: 'coffee_machine', name: 'Mycie ekspresu', price: 35, selected: false, quantity: 1 },
    { id: 'kitchen_cabinets', name: 'Sprzątanie szafek kuchennych', price: 15, selected: false, quantity: 1 },
    { id: 'radiator', name: 'Czyszczenie kaloryferów', price: 35, selected: false, quantity: 1 },
    { id: 'grout_cleaning', name: 'Czyszczenie fug', price: 19, selected: false, quantity: 1 },
    
    // Usługi dodatkowe
    { id: 'key_pickup', name: 'Odbiór kluczy', price: 35, selected: false, quantity: 1 },
    { id: 'key_delivery', name: 'Dostarczenie kluczy', price: 35, selected: false, quantity: 1 },
    
    // Czyszczenie tapicerki
    { id: 'sofa_2_3', name: 'Kanapa 2-3 os.', price: 215, selected: false, quantity: 1 },
    { id: 'corner_l', name: 'Narożnik L', price: 310, selected: false, quantity: 1 },
    { id: 'corner_u', name: 'Narożnik U', price: 410, selected: false, quantity: 1 },
    { id: 'armchair', name: 'Fotel', price: 80, selected: false, quantity: 1 },
    { id: 'chair_backrest', name: 'Krzesło z oparciem', price: 25, selected: false, quantity: 1 },
    { id: 'ottoman', name: 'Pufa', price: 30, selected: false, quantity: 1 },
    { id: 'pillow', name: 'Poduszka', price: 15, selected: false, quantity: 1 },
    
    // Opcje specjalne
    { id: 'eco', name: 'Sprzątanie ekologiczne', price: 0, selected: false, quantity: 1 },
    { id: 'post_renovation_cleaning', name: 'Doczyszczanie po remoncie (+30%)', price: 0, selected: false, quantity: 1 }
  ])
  const [formData, setFormData] = useState<OrderFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '+48 ',
    street: '',
    house_number: '',
    postal_code: '',
    city: '',
    cleaning_type: 'podstawowe',
    square_meters: 50,
    preferred_date: '',
    additional_notes: ''
  })

  // Odczytaj dane z kalkulatora przy załadowaniu komponentu
  useEffect(() => {
    const savedCalculation = localStorage.getItem('orderCalculation')
    if (savedCalculation) {
      try {
        const calculation: OrderCalculation = JSON.parse(savedCalculation)
        // Sprawdź czy dane nie są starsze niż 1 godzina
        if (Date.now() - calculation.timestamp < 3600000) {
          setOrderCalculation(calculation)
          // Ustaw dane w formularzu na podstawie kalkulacji
          setFormData(prev => ({
            ...prev,
            cleaning_type: calculation.serviceType as any,
            square_meters: calculation.area
          }))
          
          // Inicjalizuj dane kalkulatora
          setCalcServiceType(calculation.serviceType)
          setCalcArea(calculation.area)
          setCalcAdditionals(prev => 
            prev.map(service => {
              const savedService = calculation.additionalServices.find(s => s.id === service.id)
              return {
                ...service,
                selected: !!savedService,
                quantity: savedService?.quantity || service.quantity
              }
            })
          )
        } else {
          // Usuń przestarzałe dane
          localStorage.removeItem('orderCalculation')
        }
      } catch (error) {
        console.error('Błąd odczytu danych kalkulatora:', error)
        localStorage.removeItem('orderCalculation')
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Usuń prefiks +48 i wszystko co nie jest cyfrą
    const withoutPrefix = value.replace(/^\+48\s?/, '')
    const digitsOnly = withoutPrefix.replace(/\D/g, '')
    // Ogranicz do 9 cyfr
    const limitedDigits = digitsOnly.slice(0, 9)
    
    // Sformatuj z prefiksem +48 i spacjami dla lepszej czytelności
    let formattedPhone = '+48 '
    if (limitedDigits.length > 0) {
      // Formatuj jako: +48 XXX XXX XXX
      if (limitedDigits.length <= 3) {
        formattedPhone += limitedDigits
      } else if (limitedDigits.length <= 6) {
        formattedPhone += limitedDigits.slice(0, 3) + ' ' + limitedDigits.slice(3)
      } else {
        formattedPhone += limitedDigits.slice(0, 3) + ' ' + limitedDigits.slice(3, 6) + ' ' + limitedDigits.slice(6)
      }
    }
    
    setFormData(prev => ({
      ...prev,
      phone: formattedPhone
    }))
  }

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Usuń wszystko co nie jest cyfrą
    const digitsOnly = value.replace(/[^0-9]/g, '')
    
    // Ogranicz do maksymalnie 5 cyfr
    const limitedDigits = digitsOnly.slice(0, 5)
    
    // Formatuj jako XX-XXX
    let formattedCode = ''
    if (limitedDigits.length === 0) {
      formattedCode = ''
    } else if (limitedDigits.length <= 2) {
      formattedCode = limitedDigits
    } else {
      formattedCode = limitedDigits.slice(0, 2) + '-' + limitedDigits.slice(2)
    }
    
    setFormData(prev => ({
      ...prev,
      postal_code: formattedCode
    }))
  }

  // Funkcje kalkulatora
  const calculateMiniPrice = () => {
    if (calcServiceType === 'post_renovation') return 'Wycena indywidualna'
  
    let basePrice = 0
    if (calcServiceType === 'residential_onetime') {
      // Jednorazowe: konkurencyjne ceny (niższe niż duże miasto)
      if (calcArea <= 30) basePrice = 249
      else if (calcArea <= 40) basePrice = 259
      else if (calcArea <= 50) basePrice = 269
      else if (calcArea <= 60) basePrice = 289
      else if (calcArea <= 70) basePrice = 299
      else if (calcArea <= 80) basePrice = 379
      else if (calcArea <= 90) basePrice = 399
      else if (calcArea <= 100) basePrice = 429
      else if (calcArea <= 120) basePrice = 499
      else return 'Wycena indywidualna'
    } else if (calcServiceType === 'residential_weekly') {
      // Co tydzień - najtańsze (stała współpraca)
      if (calcArea <= 30) basePrice = 219
      else if (calcArea <= 40) basePrice = 229
      else if (calcArea <= 50) basePrice = 239
      else if (calcArea <= 60) basePrice = 249
      else if (calcArea <= 70) basePrice = 269
      else if (calcArea <= 80) basePrice = 299
      else if (calcArea <= 90) basePrice = 329
      else if (calcArea <= 100) basePrice = 379
      else if (calcArea <= 120) basePrice = 459
      else return 'Wycena indywidualna'
    } else if (calcServiceType === 'residential_biweekly') {
      // Co 2 tygodnie - średnie ceny
      if (calcArea <= 30) basePrice = 229
      else if (calcArea <= 40) basePrice = 239
      else if (calcArea <= 50) basePrice = 249
      else if (calcArea <= 60) basePrice = 259
      else if (calcArea <= 70) basePrice = 279
      else if (calcArea <= 80) basePrice = 309
      else if (calcArea <= 90) basePrice = 349
      else if (calcArea <= 100) basePrice = 389
      else if (calcArea <= 120) basePrice = 479
      else return 'Wycena indywidualna'
    } else if (calcServiceType === 'office') {
      if (calcArea <= 50) basePrice = 199
      else if (calcArea <= 100) basePrice = 249
      else return 'Wycena indywidualna'
    } else if (calcServiceType === 'upholstery') {
      basePrice = 200
    }
    
    let additionalPrice = 0
    calcAdditionals.filter(s => s.selected).forEach(service => {
      if (service.id === 'eco') {
        // Sprzątanie ekologiczne - GRATIS w promocji!
        additionalPrice += 0
      } else if (service.id === 'post_renovation_cleaning') {
        additionalPrice += Math.round(basePrice * 0.30)
      } else if (service.id === 'express') {
        additionalPrice += service.price
      } else {
        additionalPrice += service.price * service.quantity
      }
    })
    
    return basePrice + additionalPrice
  }
  
  const getServiceName = (type: string) => {
    switch(type) {
      case 'residential': return 'Sprzątanie mieszkań'
      case 'office': return 'Sprzątanie biur'
      case 'post_renovation': return 'Sprzątanie po remoncie'
      case 'upholstery': return 'Czyszczenie tapicerki'
      default: return 'Sprzątanie mieszkań'
    }
  }
  
  const updateCalcQuantity = (id: string, quantity: number) => {
    setCalcAdditionals(prev => 
      prev.map(service => 
        service.id === id ? { ...service, quantity: Math.max(1, quantity) } : service
      )
    )
  }

  const updateCalculatorResult = () => {
    const totalPrice = calculateMiniPrice()
    const newCalculation: OrderCalculation = {
      serviceType: calcServiceType,
      serviceName: getServiceName(calcServiceType),
      area: calcArea,
      additionalServices: calcAdditionals.filter(s => s.selected),
      totalPrice: totalPrice,
      timestamp: Date.now()
    }
    
    setOrderCalculation(newCalculation)
    setFormData(prev => ({
      ...prev,
      cleaning_type: calcServiceType as any,
      square_meters: calcArea
    }))
    localStorage.setItem('orderCalculation', JSON.stringify(newCalculation))
    setShowCalculator(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Pokaż modal potwierdzenia zamiast od razu wysyłać formularz
    setShowConfirmModal(true)
  }

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false)
    setIsSubmitting(true)

    try {
      // Połącz pola adresu w jeden string dla kompatybilności z API
      const fullAddress = `${formData.street} ${formData.house_number}, ${formData.postal_code} ${formData.city}`
      
      // Przygotuj dane do wysłania z detalami kalkulatora
      const orderData = {
        ...formData,
        // Dodaj połączony adres dla kompatybilności z istniejącym API
        address: fullAddress,
        // Dodaj dane z kalkulatora jeśli są dostępne
        calculator_data: orderCalculation ? {
          service_type: orderCalculation.serviceType,
          service_name: orderCalculation.serviceName,
          area: orderCalculation.area,
          additional_services: orderCalculation.additionalServices,
          total_price: orderCalculation.totalPrice,
          timestamp: orderCalculation.timestamp
        } : null
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
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

  // Jeśli nie ma danych z kalkulatora, przekieruj do głównej strony
  if (!orderCalculation) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Brak danych kosztorysu
          </h1>
          <p className="text-gray-600 mb-6">
            Aby złożyć zamówienie, najpierw skorzystaj z kalkulatora cen na głównej stronie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                localStorage.removeItem('orderCalculation')
                window.location.href = '/#calculator'
              }}
              className="btn-primary inline-flex items-center justify-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Wróć do kalkulatora
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Finalizacja zamówienia
        </h1>
        <p className="text-gray-600">
          Sprawdź kosztorys i podaj dane kontaktowe
        </p>
      </div>

      {/* Kosztorys z kalkulatora */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Twój kosztorys
          </h2>
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            {showCalculator ? 'Ukryj kalkulator' : 'Zmień kosztorys'}
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900">{orderCalculation.serviceName}</span>
            <span className="text-gray-600">{orderCalculation.area}m²</span>
          </div>
          
          {orderCalculation.additionalServices.length > 0 && (
            <div className="border-t pt-3">
              <div className="text-sm font-medium text-gray-700 mb-2">Usługi dodatkowe:</div>
              {orderCalculation.additionalServices.map((service, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">{service.name}</span>
                    {service.quantity && service.quantity > 1 && (
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                        x{service.quantity}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-600">
                    {service.id === 'eco' ? 
                      <span className="text-green-600 font-semibold">GRATIS</span> : 
                      service.quantity && service.quantity > 1 ? 
                      `+${service.price * service.quantity} zł` : 
                      `+${service.price} zł`
                    }
                  </span>
                </div>
              ))}
            </div>
          )}
          
          <div className="border-t pt-3 flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Razem:</span>
            <span className="text-2xl font-bold text-primary-600">
              {typeof orderCalculation.totalPrice === 'string' 
                ? orderCalculation.totalPrice 
                : `${orderCalculation.totalPrice} zł`
              }
            </span>
          </div>
        </div>
        
        {/* Mini-kalkulator */}
        {showCalculator && (
          <div className="mt-6 border-t pt-6">
            <div className="flex items-center mb-4">
              <Calculator className="mr-2 h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Przelicz ponownie</h3>
            </div>
            
            <div className="space-y-4">
              {/* Typ usługi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Typ usługi</label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { id: 'residential_weekly', name: 'Mieszkania - co tydzień', icon: Home },
                    { id: 'residential_biweekly', name: 'Mieszkania - co 2 tyg.', icon: Home },
                    { id: 'residential_onetime', name: 'Mieszkania - jednorazowe', icon: Home },
                    { id: 'office', name: 'Biura', icon: Building2 },
                    { id: 'post_renovation', name: 'Po remoncie', icon: Hammer },
                    { id: 'upholstery', name: 'Tapicerka', icon: Sparkles }
                  ].map((service) => {
                    const IconComponent = service.icon
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => setCalcServiceType(service.id)}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          calcServiceType === service.id
                            ? 'border-primary-600 bg-primary-50 text-primary-900'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent className={`h-5 w-5 mx-auto mb-1 ${
                          calcServiceType === service.id ? 'text-primary-600' : 'text-gray-400'
                        }`} />
                        <div className="text-sm font-medium">{service.name}</div>
                      </button>
                    )
                  })}
                </div>
              </div>
              
              {/* Metraż */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Powierzchnia: {calcArea}m²
                </label>
                <input
                  type="range"
                  min="10"
                  max="150"
                  value={calcArea}
                  onChange={(e) => setCalcArea(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10m²</span>
                  <span>150m²</span>
                </div>
              </div>
              
              {/* Usługi dodatkowe */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Usługi dodatkowe</label>
                  <div className="text-xs text-green-600 font-medium">
                    🎉 Sprzątanie ekologiczne GRATIS!
                  </div>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {calcAdditionals.map((service) => (
                    <div
                      key={service.id}
                      className={`p-3 rounded-lg border transition-all ${
                        service.selected 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={service.selected}
                            onChange={() => {
                              setCalcAdditionals(prev => 
                                prev.map(s => 
                                  s.id === service.id ? { ...s, selected: !s.selected } : s
                                )
                              )
                            }}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm font-medium">{service.name}</span>
                        </div>
                        <span className="text-sm">
                          {service.id === 'eco' ? 
                            <span className="text-green-600 font-semibold">GRATIS</span> : 
                           service.id === 'post_renovation_cleaning' ? 
                            <span className="text-gray-500">+30%</span> :
                           service.id === 'key_pickup' || service.id === 'key_delivery' ? 
                            <span className="text-gray-500">{`${service.price} zł`}</span> :
                           service.id === 'grout_cleaning' ? 
                            <span className="text-gray-500">{`od ${service.price} zł/m²`}</span> :
                            <span className="text-gray-500">{`${service.price} zł/szt.`}</span>
                          }
                        </span>
                      </div>
                      
                      {service.selected && service.id !== 'eco' && service.id !== 'post_renovation_cleaning' && service.id !== 'key_pickup' && service.id !== 'key_delivery' && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-600">Ilość:</span>
                            <button
                              type="button"
                              onClick={() => updateCalcQuantity(service.id, service.quantity - 1)}
                              className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={service.quantity}
                              onChange={(e) => updateCalcQuantity(service.id, parseInt(e.target.value) || 1)}
                              min="1"
                              max="99"
                              className="w-12 text-center border border-gray-300 rounded px-1 py-0.5 text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => updateCalcQuantity(service.id, service.quantity + 1)}
                              className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs"
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <div>
                              {service.id === 'eco' && (
                                <span className="text-green-600 font-medium">
                                  GRATIS!
                                </span>
                              )}
                            </div>
                            <span className="font-medium text-primary-600">
                              = {service.id === 'eco' ? 0 : service.price * service.quantity} zł
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Wynik */}
              <div className="bg-primary-50 rounded-lg p-4">
                {typeof calculateMiniPrice() === 'string' ? (
                  <div className="text-center mb-3">
                    <div className="text-lg font-bold text-primary-600 mb-1">
                      {calculateMiniPrice()}
                    </div>
                    <p className="text-xs text-gray-600">
                      Skontaktuj się z nami w celu ustalenia szczegółów
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 mb-3">
                    {/* Cena bazowa */}
                    <div className="text-sm">
                      <div className="font-medium text-gray-700 mb-1">Cena bazowa:</div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">
                          {calcServiceType === 'residential_onetime' ? 'Sprzątanie mieszkań - jednorazowe' :
                           calcServiceType === 'residential_weekly' ? 'Sprzątanie mieszkań - co tydzień' :
                           calcServiceType === 'residential_biweekly' ? 'Sprzątanie mieszkań - co 2 tygodnie' :
                           calcServiceType === 'office' ? 'Sprzątanie biur' :
                           calcServiceType === 'upholstery' ? 'Czyszczenie tapicerki' :
                           'Sprzątanie po remoncie'} ({calcArea}m²)
                        </span>
                        <span className="font-semibold">
                          {calcServiceType === 'residential_onetime' ? 
                            (calcArea <= 30 ? '249' : calcArea <= 40 ? '259' : calcArea <= 50 ? '269' : calcArea <= 60 ? '289' : calcArea <= 70 ? '299' : calcArea <= 80 ? '379' : calcArea <= 90 ? '399' : calcArea <= 100 ? '429' : calcArea <= 120 ? '499' : 'Wycena indywidualna') + (calcArea <= 120 ? ' zł' : '') :
                            calcServiceType === 'residential_weekly' ? 
                            (calcArea <= 30 ? '219' : calcArea <= 40 ? '229' : calcArea <= 50 ? '239' : calcArea <= 60 ? '249' : calcArea <= 70 ? '269' : calcArea <= 80 ? '299' : calcArea <= 90 ? '329' : calcArea <= 100 ? '379' : calcArea <= 120 ? '459' : 'Wycena indywidualna') + (calcArea <= 120 ? ' zł' : '') :
                            calcServiceType === 'residential_biweekly' ? 
                            (calcArea <= 30 ? '229' : calcArea <= 40 ? '239' : calcArea <= 50 ? '249' : calcArea <= 60 ? '259' : calcArea <= 70 ? '279' : calcArea <= 80 ? '309' : calcArea <= 90 ? '349' : calcArea <= 100 ? '389' : calcArea <= 120 ? '479' : 'Wycena indywidualna') + (calcArea <= 120 ? ' zł' : '') :
                            calcServiceType === 'office' ? 
                            (calcArea <= 50 ? '199' : calcArea <= 100 ? '249' : 'Wycena indywidualna') + (calcArea <= 100 ? ' zł' : '') :
                            calcServiceType === 'upholstery' ? '200 zł' : 'Wycena indywidualna'
                          }
                        </span>
                      </div>
                    </div>
                    
                    {/* Usługi dodatkowe */}
                    {calcAdditionals.some(s => s.selected) && (
                      <div className="text-sm">
                        <div className="font-medium text-gray-700 mb-1">Usługi dodatkowe:</div>
                        <div className="space-y-1">
                          {calcAdditionals.filter(s => s.selected).map(service => (
                            <div key={service.id} className="flex justify-between items-center">
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-600 text-xs">{service.name}</span>
                                {service.quantity > 1 && service.id !== 'eco' && service.id !== 'express' && (
                                  <span className="text-xs bg-primary-100 text-primary-700 px-1 py-0.5 rounded font-medium">
                                    x{service.quantity}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs">
                                {service.id === 'eco' ? 
                                  <span className="text-green-600 font-semibold">GRATIS</span> : 
                                  service.id === 'post_renovation_cleaning' ?
                                  '+30%' :
                                  service.id === 'express' ?
                                  `+${service.price} zł` :
                                  `+${service.price * service.quantity} zł`
                                }
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Suma */}
                    <div className="border-t pt-2 flex justify-between items-center">
                      <span className="font-bold text-gray-900">Razem:</span>
                      <span className="text-xl font-bold text-primary-600">
                        {calculateMiniPrice()} zł
                      </span>
                    </div>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={updateCalculatorResult}
                  className="w-full btn-primary mt-3"
                >
                  Zaktualizuj kosztorys
                </button>
              </div>
            </div>
          </div>
        )}
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
                onChange={handlePhoneChange}
                required
                className="form-input"
                placeholder="+48 880 118 995"
                maxLength={17}
              />
              <div className="text-xs text-gray-500 mt-1">
                Wpisz 9 cyfr numeru telefonu
              </div>
            </div>
          </div>

          {/* Adres - pola rozdzielone */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-primary-600" />
              Adres *
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="street" className="form-label">
                  Ulica *
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="ul. Przykładowa"
                />
              </div>
              <div>
                <label htmlFor="house_number" className="form-label">
                  Nr domu/mieszkania *
                </label>
                <input
                  type="text"
                  id="house_number"
                  name="house_number"
                  value={formData.house_number}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="123/45"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="postal_code" className="form-label">
                  Kod pocztowy *
                </label>
                <input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handlePostalCodeChange}
                  required
                  className="form-input"
                  placeholder="34-300"
                  maxLength={6}
                  pattern="[0-9]{2}-[0-9]{3}"
                  title="Wprowadź kod pocztowy w formacie XX-XXX"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Format: XX-XXX (np. 34-300)
                </div>
              </div>
              <div>
                <label htmlFor="city" className="form-label">
                  Miasto *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Żywiec"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Szczegóły zamówienia */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Szczegóły zamówienia
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                <CheckCircle className="inline h-4 w-4 text-green-600 mr-1" />
                Skontaktujemy się w ciągu 24h
              </div>
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
              placeholder="Opisz dodatkowe wymagania, dostęp do mieszkania, kod do bramy, itp..."
            />
          </div>
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
              typeof orderCalculation.totalPrice === 'string'
                ? 'Wyślij zapytanie o wycenę'
                : `Potwierdź zamówienie za ${orderCalculation.totalPrice} zł`
            )}
          </button>
          <p className="text-sm text-gray-500 text-center mt-3">
            Po wysłaniu zgłoszenia otrzymasz link do śledzenia statusu zlecenia
          </p>
        </div>
      </form>

      {/* Modal potwierdzenia zamówienia */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <CheckCircle className="h-6 w-6 text-yellow-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Uwaga! Zaraz wyślesz zgłoszenie o sprzątanie
              </h3>
              
              <div className="text-sm text-gray-600 space-y-3 mb-6">
                <p className="font-medium text-yellow-700 bg-yellow-50 p-3 rounded-lg">
                  📊 Kalkulator jest orientacyjny - cena finalna może się różnić
                </p>
                
                <p>
                  📅 <strong>Sprzątanie cykliczne:</strong> Możliwość ustalenia sprzątania 
                  więcej niż raz w tygodniu zostanie omawiana podczas rozmowy telefonicznej 
                  po zaakceptowaniu zlecenia.
                </p>
                
                <p>
                  📞 Po wysłaniu zgłoszenia skontaktujemy się z Tobą w ciągu 24 godzin 
                  w celu potwierdzenia szczegółów i ustalenia terminu.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Wyślij zgłoszenie'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
