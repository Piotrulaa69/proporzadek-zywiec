import { Home, Building2, Hammer, Sparkles, CheckCircle } from 'lucide-react'

export default function ServicesSection() {
  const services = [
    {
      icon: Home,
      title: 'Sprzątanie mieszkań',
      description: 'Kompleksowe sprzątanie mieszkań i domów jednorodzinnych',
      features: [
        'Odkurzanie i mycie podłóg',
        'Czyszczenie łazienek i kuchni',
        'Wycieranie kurzu z mebli',
        'Mycie okien od wewnątrz',
        'Wynoszenie śmieci'
      ],
      priceFrom: 80,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      icon: Building2,
      title: 'Sprzątanie biur',
      description: 'Profesjonalne utrzymanie czystości w przestrzeniach biurowych',
      features: [
        'Sprzątanie sal konferencyjnych',
        'Czyszczenie stanowisk pracy',
        'Utrzymanie kuchni biurowej',
        'Mycie okien i witryn',
        'Dezynfekcja powierzchni'
      ],
      priceFrom: 120,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      icon: Hammer,
      title: 'Sprzątanie po remoncie',
      description: 'Specjalistyczne sprzątanie po zakończonych pracach remontowych',
      features: [
        'Usuwanie pyłu budowlanego',
        'Mycie okien i ram',
        'Czyszczenie podłóg z resztek',
        'Usuwanie plam z farby',
        'Przygotowanie do użytkowania'
      ],
      priceFrom: 200,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    }
  ]

  return (
    <section id="services" className="bg-gray-50 section-padding">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Nasze usługi
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Oferujemy kompleksowe usługi sprzątania dostosowane do różnych potrzeb. 
            Każda usługa wykonywana jest z najwyższą starannością i profesjonalizmem.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="card p-8 hover:scale-105 transition-transform duration-300">
              {/* Service Image */}
              <div className="relative mb-6 overflow-hidden rounded-lg">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 bg-primary-600 p-2 rounded-lg">
                  <service.icon className="h-6 w-6 text-white" />
                </div>
              </div>

              {/* Service Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>

                {/* Features List */}
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary-600 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Cena od:</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {service.priceFrom} zł
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Services */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Usługi dodatkowe
            </h3>
            <p className="text-gray-600 mb-6">
              Oferujemy również mycie okien, pranie tapicerki, czyszczenie dywanów 
              i wiele innych usług dostosowanych do Twoich potrzeb.
            </p>
            <a href="#contact" className="btn-primary">
              Zapytaj o wycenę
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
