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
}

const serviceTypes: ServiceOption[] = [
  { id: 'basic', name: 'Sprzątanie podstawowe', basePrice: 80, unit: 'za mieszkanie' },
  { id: 'deep', name: 'Sprzątanie głębokie', basePrice: 120, unit: 'za mieszkanie' },
  { id: 'office', name: 'Sprzątanie biurowe', basePrice: 100, unit: 'za biuro' },
  { id: 'post_renovation', name: 'Sprzątanie po remoncie', basePrice: 200, unit: 'za mieszkanie' }
]

const additionalServices: AdditionalService[] = [
  { id: 'windows', name: 'Mycie okien', price: 50, selected: false },
  { id: 'carpet', name: 'Pranie dywanów', price: 80, selected: false },
  { id: 'balcony', name: 'Sprzątanie balkonu', price: 30, selected: false },
  { id: 'garage', name: 'Sprzątanie garażu', price: 100, selected: false },
  { id: 'basement', name: 'Sprzątanie piwnicy', price: 70, selected: false }
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

  const calculatePrice = () => {
    let basePrice = selectedService.basePrice
    
    // Dodaj cenę za powierzchnię (powyżej 50m²)
    if (area > 50) {
      basePrice += (area - 50) * 2
    }
    
    // Dodaj cenę za dodatkowe pokoje (powyżej 2)
    if (rooms > 2) {
      basePrice += (rooms - 2) * 25
    }
    
    // Dodaj usługi dodatkowe
    const additionalPrice = additionals
      .filter(service => service.selected)
      .reduce((sum, service) => sum + service.price, 0)
    
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
                  {service.basePrice} zł {service.unit}
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

        {/* Liczba pokoi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Liczba pokoi: {rooms}
          </label>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setRooms(Math.max(1, rooms - 1))}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="range"
              min="1"
              max="10"
              value={rooms}
              onChange={(e) => setRooms(Number(e.target.value))}
              className="flex-1"
            />
            <button
              onClick={() => setRooms(Math.min(10, rooms + 1))}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Cena bazowa dla 2 pokoi. Każdy dodatkowy pokój +25zł
          </div>
        </div>

        {/* Usługi dodatkowe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Usługi dodatkowe
          </label>
          <div className="space-y-2">
            {additionals.map((service) => (
              <label
                key={service.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={service.selected}
                    onChange={() => toggleAdditional(service.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium">{service.name}</span>
                </div>
                <span className="text-sm text-gray-600">+{service.price} zł</span>
              </label>
            ))}
          </div>
        </div>

        {/* Podsumowanie */}
        <div className="border-t pt-6">
          <div className="bg-primary-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Cena bazowa:</span>
              <span className="text-sm">{selectedService.basePrice} zł</span>
            </div>
            
            {area > 50 && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Dodatkowa powierzchnia ({area - 50}m²):
                </span>
                <span className="text-sm">+{(area - 50) * 2} zł</span>
              </div>
            )}
            
            {rooms > 2 && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Dodatkowe pokoje ({rooms - 2}):
                </span>
                <span className="text-sm">+{(rooms - 2) * 25} zł</span>
              </div>
            )}
            
            {additionals.some(s => s.selected) && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Usługi dodatkowe:</span>
                <span className="text-sm">
                  +{additionals.filter(s => s.selected).reduce((sum, s) => sum + s.price, 0)} zł
                </span>
              </div>
            )}
            
            <div className="border-t border-primary-200 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Razem:</span>
                <span className="text-2xl font-bold text-primary-600">{totalPrice} zł</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 mb-3">
              * Cena orientacyjna. Ostateczna wycena po oględzinach
            </p>
            <a
              href="/order"
              className="btn-primary inline-block"
            >
              Zamów za {totalPrice} zł
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
