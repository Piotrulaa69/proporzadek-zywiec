'use client'

import { Check, Star, Home, Building, Wrench, Sofa } from 'lucide-react'
import Link from 'next/link'
import PriceCalculator from '@/components/PriceCalculator'

export default function PricingSection() {
  const mainServices = [
    {
      name: 'Sprzątanie regularne',
      description: 'Sprzątanie co tydzień lub co 2 tygodnie',
      icon: Home,
      priceFrom: 239,
      features: [
        'Co tydzień - od 239 zł',
        'Co 2 tygodnie - od 259 zł',
        'Niższe ceny przy regularnej współpracy',
        'Stabilna współpraca',
        'Sprzątanie ekologiczne GRATIS'
      ],
      popular: true
    },
    {
      name: 'Sprzątanie mieszkań - jednorazowe',
      description: 'Kompleksowe sprzątanie domów i mieszkań',
      icon: Home,
      priceFrom: 269,
      features: [
        'Do 50m² - 269 zł',
        'Powyżej 50m² - +2,5zł za każdy m²',
        'Sprzątanie ekologiczne GRATIS',
        'Mycie okien w cenie'
      ],
      popular: false
    },
    {
      name: 'Sprzątanie biur',
      description: 'Profesjonalne sprzątanie przestrzeni biurowych',
      icon: Building,
      priceFrom: 199,
      features: [
        'Do 50m² - 199 zł',
        'Do 100m² - 249 zł',
        'Regularna współpraca',
        'Profesjonalne środki'
      ],
      popular: false
    },
    {
      name: 'Sprzątanie po remoncie',
      description: 'Usuwanie zabrudzeń po pracach budowlanych',
      icon: Wrench,
      priceFrom: null,
      features: [
        'Wycena indywidualna',
        'Specjalistyczne środki',
        'Usuwanie pyłu budowlanego',
        'Przywrócenie czystości'
      ],
      popular: false
    }
  ]

  const frequencyOptions = [
    {
      name: 'Raz w tygodniu',
      discount: 'Najlepsza cena',
      description: 'Regularne sprzątanie co tydzień',
      benefits: ['Najniższe ceny', 'Priorytetowe terminy', 'Stały harmonogram']
    },
    {
      name: 'Co 2 tygodnie',
      discount: 'Średnia cena',
      description: 'Sprzątanie co dwa tygodnie',
      benefits: ['Optymalna cena', 'Elastyczne terminy', 'Przypomnienia SMS']
    },
    {
      name: 'Jednorazowo',
      discount: 'Standardowa cena',
      description: 'Sprzątanie na żądanie',
      benefits: ['Pełna elastyczność', 'Bez zobowiązań', 'Szybka realizacja']
    }
  ]

  const promotions = [
    { name: 'Poleć znajomego', benefit: 'Oboje otrzymujecie -10% rabatu' },
    { name: '5. usługa', benefit: 'Rabat -10%' },
    { name: '10. usługa', benefit: 'GRATIS (do 250 zł) lub rabat 250 zł' },
    { name: 'Recenzja online', benefit: 'Rabat -10% lub 10 zł zniżki' }
  ]

  return (
    <section id="pricing" className="bg-white section-padding">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Cennik usług
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transparentne ceny bez ukrytych kosztów. Ceny zależą od metrażu i częstotliwości sprzątania. 
            Skorzystaj z kalkulatora lub skontaktuj się z nami po bezpłatną wycenę.
          </p>
        </div>

        {/* Main Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {mainServices.map((service, index) => {
            const IconComponent = service.icon
            return (
              <div
                key={index}
                className={`relative card p-6 ${
                  service.popular ? 'ring-2 ring-primary-500 scale-105' : ''
                }`}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <Star className="h-3 w-3" />
                      <span>Popularne</span>
                    </div>
                  </div>
                )}

                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto">
                    <IconComponent className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                  
                  <div className="space-y-2">
                    {service.priceFrom ? (
                      <>
                        <div className="text-2xl font-bold text-gray-900">
                          od {service.priceFrom} zł
                        </div>
                        <div className="text-xs text-gray-500">w zależności od metrażu</div>
                      </>
                    ) : (
                      <div className="text-lg font-semibold text-primary-600">
                        Wycena indywidualna
                      </div>
                    )}
                  </div>

                  <ul className="space-y-2 text-left">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-2">
                        <Check className="h-3 w-3 text-primary-600 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      // Przewiń bezpośrednio do kalkulatora
                      const calculatorSection = document.getElementById('calculator')
                      if (calculatorSection) {
                        calculatorSection.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    className={`w-full text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      service.popular
                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    Oblicz cenę
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Frequency Options */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Częstotliwość sprzątania
            </h3>
            <p className="text-gray-600">
              Im częściej, tym taniej! Wybierz opcję dopasowaną do Twoich potrzeb.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {frequencyOptions.map((option, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{option.name}</h4>
                  <div className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                    {option.discount}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 text-center">{option.description}</p>
                <ul className="space-y-2">
                  {option.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-primary-600" />
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <a href="#calculator" className="btn-primary">
              Skorzystaj z kalkulatora
            </a>
          </div>
        </div>

        {/* Promotions */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Promocje i rabaty
            </h3>
            <p className="text-gray-600">
              Skorzystaj z naszych promocji i oszczędzaj na usługach sprzątania.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {promotions.map((promo, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{promo.name}</h4>
                    <p className="text-sm text-gray-600">{promo.benefit}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Rabaty naliczane są automatycznie przy rezerwacji.
            </p>
          </div>
        </div>

        {/* Price Calculator */}
        <div id="calculator" className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Oblicz orientacyjną cenę
            </h3>
            <p className="text-gray-600">
              Wprowadź metraż i wybierz usługi, aby poznać orientacyjną cenę według aktualnego cennika
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <PriceCalculator />
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Podane ceny są orientacyjne i mogą się różnić w zależności od stanu lokalu. 
            Regularna współpraca = niższe ceny! 
            <a href="#contact" className="text-primary-600 hover:text-primary-700 font-medium ml-1">
              Skontaktuj się z nami
            </a> po dokładną wycenę.
          </p>
        </div>
      </div>
    </section>
  )
}
