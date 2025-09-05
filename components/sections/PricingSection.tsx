import { Check, Star } from 'lucide-react'
import Link from 'next/link'
import PriceCalculator from '@/components/PriceCalculator'

export default function PricingSection() {
  const pricingPlans = [
    {
      name: 'Podstawowy',
      description: 'Idealne dla małych mieszkań',
      price: 80,
      unit: 'za wizytę',
      features: [
        'Mieszkania do 50m²',
        'Podstawowe sprzątanie',
        'Odkurzanie i mycie podłóg',
        'Czyszczenie łazienki',
        'Wycieranie kurzu'
      ],
      popular: false
    },
    {
      name: 'Standard',
      description: 'Najczęściej wybierany pakiet',
      price: 120,
      unit: 'za wizytę',
      features: [
        'Mieszkania do 80m²',
        'Kompleksowe sprzątanie',
        'Mycie okien od wewnątrz',
        'Czyszczenie kuchni',
        'Wynoszenie śmieci',
        'Zmiana pościeli'
      ],
      popular: true
    },
    {
      name: 'Premium',
      description: 'Dla większych przestrzeni',
      price: 180,
      unit: 'za wizytę',
      features: [
        'Mieszkania powyżej 80m²',
        'Pełne sprzątanie',
        'Mycie okien wewnątrz i na zewnątrz',
        'Czyszczenie lodówki',
        'Pranie i prasowanie',
        'Usługi dodatkowe'
      ],
      popular: false
    }
  ]

  const subscriptionPlans = [
    {
      name: 'Abonament Tygodniowy',
      discount: '20%',
      description: 'Sprzątanie co tydzień',
      benefits: ['Stała zniżka 20%', 'Priorytetowe terminy', 'Elastyczność zmian']
    },
    {
      name: 'Abonament Miesięczny',
      discount: '15%',
      description: 'Sprzątanie raz w miesiącu',
      benefits: ['Stała zniżka 15%', 'Przypomnienia SMS', 'Gwarancja jakości']
    }
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
            Transparentne ceny bez ukrytych kosztów. Wybierz pakiet odpowiedni 
            dla Twojego mieszkania lub skorzystaj z abonamenty i oszczędzaj.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative card p-8 ${
                plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>Najpopularniejszy</span>
                  </div>
                </div>
              )}

              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-gray-600">{plan.description}</p>
                
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-gray-900">
                    {plan.price} zł
                  </div>
                  <div className="text-sm text-gray-500">{plan.unit}</div>
                </div>

                <ul className="space-y-3 text-left">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-primary-600 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/order"
                  className={`w-full inline-block text-center py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${
                    plan.popular
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  Wybierz pakiet
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Subscription Plans */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Abonamenty - oszczędzaj więcej!
            </h3>
            <p className="text-gray-600">
              Wybierz abonament i ciesz się stałymi zniżkami oraz dodatkowymi korzyściami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {subscriptionPlans.map((plan, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    -{plan.discount}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <ul className="space-y-2">
                  {plan.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/order" className="btn-primary">
              Zamów z abonamentem
            </Link>
          </div>
        </div>

        {/* Price Calculator */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Oblicz orientacyjną cenę
            </h3>
            <p className="text-gray-600">
              Skorzystaj z naszego kalkulatora, aby poznać przybliżoną cenę usługi
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <PriceCalculator />
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Ceny mogą się różnić w zależności od stanu mieszkania i dodatkowych usług. 
            <a href="#contact" className="text-primary-600 hover:text-primary-700 font-medium ml-1">
              Skontaktuj się z nami
            </a> po bezpłatną wycenę.
          </p>
        </div>
      </div>
    </section>
  )
}
