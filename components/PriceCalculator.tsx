'use client'

import { useState } from 'react'
import { Calculator, Plus, Minus } from 'lucide-react'

interface ServiceOption {
  id: string
  name: string
  basePrice: number
  unit: string
}

interface AdditionalService {
  id: string
  name: string
  price: number
  selected: boolean
  quantity: number
}

const serviceTypes: ServiceOption[] = [
  { id: 'residential_weekly', name: 'Sprzątanie mieszkań - co tydzień', basePrice: 219, unit: 'za mieszkanie' },
  { id: 'residential_biweekly', name: 'Sprzątanie mieszkań - co 2 tygodnie', basePrice: 229, unit: 'za mieszkanie' },
  { id: 'residential_onetime', name: 'Sprzątanie mieszkań - jednorazowe', basePrice: 249, unit: 'za mieszkanie' },
  { id: 'office', name: 'Sprzątanie biur', basePrice: 199, unit: 'za biuro' },
  { id: 'post_renovation', name: 'Sprzątanie po remoncie', basePrice: 0, unit: 'wycena indywidualna' },
  { id: 'upholstery', name: 'Czyszczenie tapicerki', basePrice: 200, unit: 'za kanapę 2-3 os.' }
]

const additionalServices: AdditionalService[] = [
  // Okna i drzwi
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
]

export default function PriceCalculator() {
  const [selectedService, setSelectedService] = useState<ServiceOption>(serviceTypes[0])
  const [area, setArea] = useState(50) // m²
  const [rooms, setRooms] = useState(2)
  const [additionals, setAdditionals] = useState<AdditionalService[]>(additionalServices)
  const [isOpen, setIsOpen] = useState(false)

  const toggleAdditional = (id: string) => {
    setAdditionals(prev => 
      prev.map(service => 
        service.id === id ? { ...service, selected: !service.selected } : service
      )
    )
  }

  const updateQuantity = (id: string, quantity: number) => {
    setAdditionals(prev => 
      prev.map(service => 
        service.id === id ? { ...service, quantity: Math.max(1, quantity) } : service
      )
    )
  }

  // Uproszczona funkcja cenowa - bez rabatów ilościowych
  const getQuantityPrice = (service: AdditionalService) => {
    return service.price // Prosta cena bez rabatów
  }

  const calculatePrice = () => {
    // Sprzątanie po remoncie - wycena indywidualna
    if (selectedService.id === 'post_renovation') {
      return 'Wycena indywidualna'
    }
    
    let basePrice = 0
    
    // Cennik dla sprzątania mieszkań - konkurencyjny dla małego miasta 2025
    if (selectedService.id === 'residential_onetime') {
      // Jednorazowe: konkurencyjne ceny (niższe niż duże miasto)
      if (area <= 30) basePrice = 249
      else if (area <= 40) basePrice = 259
      else if (area <= 50) basePrice = 269
      else if (area <= 60) basePrice = 289
      else if (area <= 70) basePrice = 299
      else if (area <= 80) basePrice = 379
      else if (area <= 90) basePrice = 399
      else if (area <= 100) basePrice = 429
      else if (area <= 120) basePrice = 499
      else return 'Wycena indywidualna'
    }
    else if (selectedService.id === 'residential_weekly') {
      // Co tydzień - najtańsze (stała współpraca)
      if (area <= 30) basePrice = 219
      else if (area <= 40) basePrice = 229
      else if (area <= 50) basePrice = 239
      else if (area <= 60) basePrice = 249
      else if (area <= 70) basePrice = 269
      else if (area <= 80) basePrice = 299
      else if (area <= 90) basePrice = 329
      else if (area <= 100) basePrice = 379
      else if (area <= 120) basePrice = 459
      else return 'Wycena indywidualna'
    }
    else if (selectedService.id === 'residential_biweekly') {
      // Co 2 tygodnie - średnie ceny
      if (area <= 30) basePrice = 229
      else if (area <= 40) basePrice = 239
      else if (area <= 50) basePrice = 249
      else if (area <= 60) basePrice = 259
      else if (area <= 70) basePrice = 279
      else if (area <= 80) basePrice = 309
      else if (area <= 90) basePrice = 349
      else if (area <= 100) basePrice = 389
      else if (area <= 120) basePrice = 479
      else return 'Wycena indywidualna'
    }
    
    // Cennik dla sprzątania biur - nowy promocyjny
    else if (selectedService.id === 'office') {
      if (area <= 50) basePrice = 199
      else if (area <= 100) basePrice = 249
      else return 'Wycena indywidualna'
    }
    
    // Czyszczenie tapicerki - cena bazowa
    else if (selectedService.id === 'upholstery') {
      basePrice = selectedService.basePrice
    }
    
    // Dodaj usługi dodatkowe
    let additionalPrice = 0
    additionals.filter(service => service.selected).forEach(service => {
      if (service.id === 'eco') {
        // Sprzątanie ekologiczne - GRATIS w promocji!
        additionalPrice += 0
      } else if (service.id === 'post_renovation_cleaning') {
        // Doczyszczanie po remoncie +30%
        additionalPrice += Math.round(basePrice * 0.30)
      } else if (service.id === 'express') {
        // Opcja ekspresowa - jednorazowa dopłata 59zł
        additionalPrice += service.price
      } else {
        // Prosta cena bez rabatów
        additionalPrice += service.price * service.quantity
      }
    })
    
    return basePrice + additionalPrice
  }

  const totalPrice = calculatePrice()

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calculator className="h-6 w-6 text-primary-600" />
          <h3 className="text-xl font-semibold text-gray-900">Kalkulator Cen</h3>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden btn-secondary"
        >
          {isOpen ? 'Zwiń' : 'Rozwiń'}
        </button>
      </div>

      <div className={`space-y-6 ${isOpen ? 'block' : 'hidden md:block'}`}>
        {/* Typ usługi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Typ sprzątania
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {serviceTypes.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                  selectedService.id === service.id
                    ? 'border-primary-600 bg-primary-50 text-primary-900'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{service.name}</div>
                <div className="text-sm text-gray-600">
                  {service.id === 'post_renovation' ? 
                    service.unit : 
                    `od ${service.basePrice} zł ${service.unit}`
                  }
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Powierzchnia */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Powierzchnia: {area} m²
          </label>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setArea(Math.max(20, area - 10))}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="range"
              min="20"
              max="200"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              className="flex-1"
            />
            <button
              onClick={() => setArea(Math.min(200, area + 10))}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Cena bazowa dla 50m². Każdy dodatkowy m² +2zł
          </div>
        </div>

        {/* Pokoje - tylko dla tapicerki */}
        {selectedService.id === 'upholstery' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Liczba elementów do wyczyszczenia
            </label>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setRooms(Math.max(1, rooms - 1))}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-2xl font-semibold text-gray-900 min-w-[3rem] text-center">
                {rooms}
              </span>
              <button
                onClick={() => setRooms(rooms + 1)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Cena bazowa za kanapę 2-osobową. Inne meble według cennika.
            </div>
          </div>
        )}

        {/* Usługi dodatkowe */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Usługi dodatkowe
            </label>
            <div className="text-xs text-green-600 font-medium">
              🎉 Sprzątanie ekologiczne GRATIS!
            </div>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {additionals.map((service) => (
              <div
                key={service.id}
                className={`p-3 rounded-lg border-2 transition-all ${
                  service.selected 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={service.selected}
                      onChange={() => toggleAdditional(service.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium">{service.name}</span>
                  </div>
                  <span className="text-sm">
                    {service.id === 'eco' ? 
                      <span className="text-green-600 font-semibold">GRATIS</span> : 
                     service.id === 'post_renovation_cleaning' ? 
                      <span className="text-gray-600">+30%</span> :
                     service.id === 'key_pickup' || service.id === 'key_delivery' ? 
                      <span className="text-gray-600">{`${service.price} zł`}</span> :
                     service.id === 'glass_balustrade' ? 
                      <span className="text-gray-600">{`${service.price} zł/m²`}</span> :
                     service.id === 'grout_cleaning' ? 
                      <span className="text-gray-600">{`od ${service.price} zł/m²`}</span> :
                      <span className="text-gray-600">{`${service.price} zł/szt.`}</span>
                    }
                  </span>
                </div>
                
                {service.selected && service.id !== 'eco' && service.id !== 'post_renovation_cleaning' && service.id !== 'key_pickup' && service.id !== 'key_delivery' && (
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">Ilość:</span>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(service.id, service.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={service.quantity}
                          onChange={(e) => updateQuantity(service.id, parseInt(e.target.value) || 1)}
                          min="1"
                          max="99"
                          className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => updateQuantity(service.id, service.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        {getQuantityPrice(service) < service.price && (
                          <span className="text-green-600 font-medium">
                            🎉 Rabat ilościowy! {service.price} zł → {getQuantityPrice(service)} zł
                          </span>
                        )}
                      </div>
                      <span className="font-medium text-primary-600">
                        = {getQuantityPrice(service) * service.quantity} zł
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Podsumowanie */}
        <div className="border-t pt-6">
          <div className="bg-primary-50 rounded-lg p-4">
            {typeof totalPrice === 'string' ? (
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-2">
                  {totalPrice}
                </div>
                <p className="text-sm text-gray-600">
                  Skontaktuj się z nami w celu ustalenia szczegółów i wyceny
                </p>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-700 mb-1">Cena bazowa:</div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{selectedService.name} ({area}m²)</span>
                    <span className="text-sm font-semibold">
                      {selectedService.id === 'residential_onetime' ? 
                        (area <= 30 ? '249' : area <= 40 ? '259' : area <= 50 ? '269' : area <= 60 ? '289' : area <= 70 ? '299' : area <= 80 ? '379' : area <= 90 ? '399' : area <= 100 ? '429' : area <= 120 ? '499' : 'Wycena indywidualna') + (area <= 120 ? ' zł' : '') :
                        selectedService.id === 'residential_weekly' ? 
                        (area <= 30 ? '219' : area <= 40 ? '229' : area <= 50 ? '239' : area <= 60 ? '249' : area <= 70 ? '269' : area <= 80 ? '299' : area <= 90 ? '329' : area <= 100 ? '379' : area <= 120 ? '459' : 'Wycena indywidualna') + (area <= 120 ? ' zł' : '') :
                        selectedService.id === 'residential_biweekly' ? 
                        (area <= 30 ? '229' : area <= 40 ? '239' : area <= 50 ? '249' : area <= 60 ? '259' : area <= 70 ? '279' : area <= 80 ? '309' : area <= 90 ? '349' : area <= 100 ? '389' : area <= 120 ? '479' : 'Wycena indywidualna') + (area <= 120 ? ' zł' : '') :
                        selectedService.id === 'office' ? 
                        (area <= 50 ? '199' : area <= 100 ? '249' : 'Wycena indywidualna') + (area <= 100 ? ' zł' : '') :
                        selectedService.basePrice + ' zł'
                      }
                    </span>
                  </div>
                </div>
                
                {additionals.some(s => s.selected) && (
                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">Usługi dodatkowe:</div>
                    <div className="space-y-1">
                    {additionals.filter(s => s.selected).map(service => (
                      <div key={service.id} className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">
                          {service.name}{service.quantity > 1 && service.id !== 'eco' && service.id !== 'express' ? ` (${service.quantity}x)` : ''}:
                        </span>
                        <span className="text-xs">
                          {service.id === 'eco' ? 
                            <span className="text-green-600 font-semibold">GRATIS!</span> :
                            service.id === 'post_renovation_cleaning' ?
                            `+${Math.round((typeof totalPrice === 'number' ? totalPrice - additionals.filter(s => s.selected && s.id !== 'eco' && s.id !== 'post_renovation_cleaning' && s.id !== 'express').reduce((sum, s) => sum + (s.id === 'express' ? s.price : service.price * s.quantity), 0) : 0) * 0.30)} zł` :
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
                
                <div className="border-t border-primary-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Razem:</span>
                    <span className="text-2xl font-bold text-primary-600">{totalPrice} zł</span>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 mb-3">
              * Cena orientacyjna. Ostateczna wycena może się różnić w zależności od stanu lokalu
            </p>
            {typeof totalPrice === 'string' ? (
              <button
                onClick={() => {
                  const orderData = {
                    serviceType: selectedService.id,
                    serviceName: selectedService.name,
                    area: area,
                    additionalServices: additionals.filter(s => s.selected),
                    totalPrice: 'Wycena indywidualna',
                    timestamp: Date.now()
                  }
                  localStorage.setItem('orderCalculation', JSON.stringify(orderData))
                  window.location.href = '/order'
                }}
                className="btn-primary inline-block"
              >
                Zapytaj o wycenę
              </button>
            ) : (
              <button
                onClick={() => {
                  const orderData = {
                    serviceType: selectedService.id,
                    serviceName: selectedService.name,
                    area: area,
                    additionalServices: additionals.filter(s => s.selected),
                    totalPrice: totalPrice,
                    timestamp: Date.now()
                  }
                  localStorage.setItem('orderCalculation', JSON.stringify(orderData))
                  window.location.href = '/order'
                }}
                className="btn-primary inline-block"
              >
                Zamów za {totalPrice} zł
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
