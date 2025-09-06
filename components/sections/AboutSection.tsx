'use client'

import { Shield, Award, Heart, Zap, Sparkles } from 'lucide-react'

export default function AboutSection() {
  const features = [
    {
      icon: Shield,
      title: 'Zaufanie i bezpieczeństwo',
      description: 'Wszyscy nasi pracownicy są sprawdzeni i ubezpieczeni. Gwarantujemy pełne bezpieczeństwo Twojego mienia.'
    },
    {
      icon: Award,
      title: 'Doświadczenie',
      description: 'Ponad 5 lat doświadczenia w branży sprzątania. Obsłużyliśmy setki zadowolonych klientów w regionie.'
    },
    {
      icon: Heart,
      title: 'Indywidualne podejście',
      description: 'Każde zlecenie traktujemy indywidualnie. Dostosowujemy nasze usługi do Twoich potrzeb i wymagań.'
    },
    {
      icon: Zap,
      title: 'Szybkość i efektywność',
      description: 'Pracujemy szybko i efektywnie, nie tracąc przy tym na jakości. Twój czas jest dla nas cenny.'
    }
  ]

  return (
    <section id="about" className="bg-white section-padding">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Kim jesteśmy?
              </h2>
              <p className="text-lg text-gray-600">
                ProPorządek Żywiec to zespół doświadczonych specjalistów, którzy od lat 
                dbają o czystość domów i biur w Żywcu i okolicach. Nasza misja to 
                zapewnienie najwyższej jakości usług sprzątania z pełnym zaangażowaniem 
                i profesjonalizmem.
              </p>
              <p className="text-lg text-gray-600">
                Wierzymy, że czyste otoczenie wpływa na jakość życia i produktywność. 
                Dlatego każde zlecenie wykonujemy z najwyższą starannością, używając 
                profesjonalnych środków i nowoczesnego sprzętu.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-100 p-2 rounded-lg">
                      <feature.icon className="h-5 w-5 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Banner */}
          <div className="relative">
            {/* Professional CSS Banner */}
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-2xl shadow-xl flex items-center justify-center text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
                  <div className="absolute top-20 right-16 w-16 h-16 border-2 border-white rounded-full"></div>
                  <div className="absolute bottom-16 left-20 w-12 h-12 border-2 border-white rounded-full"></div>
                  <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-white rounded-full"></div>
                </div>
                
                {/* Main Content */}
                <div className="text-center z-10 px-8">
                  {/* Logo */}
                  <div className="mb-6">
                    <div className="bg-white p-4 rounded-2xl shadow-lg inline-block mb-4">
                      <Sparkles className="h-12 w-12 text-primary-600" />
                    </div>
                  </div>
                  
                  {/* Company Name */}
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-wide">
                    ProPorządek
                    <span className="block text-3xl md:text-4xl font-light mt-2">
                      Żywiec
                    </span>
                  </h1>
                  
                  {/* Tagline */}
                  <p className="text-xl md:text-2xl font-light opacity-90 mb-6">
                    Profesjonalne usługi sprzątania
                  </p>
                  
                  {/* Decorative Line */}
                  <div className="w-24 h-1 bg-white mx-auto rounded-full opacity-80"></div>
                </div>
                
                {/* Sparkle Effects */}
                <div className="absolute top-1/4 left-1/4 animate-pulse">
                  <Sparkles className="h-6 w-6 text-white opacity-60" />
                </div>
                <div className="absolute top-1/3 right-1/3 animate-pulse delay-1000">
                  <Sparkles className="h-4 w-4 text-white opacity-40" />
                </div>
                <div className="absolute bottom-1/4 right-1/4 animate-pulse delay-500">
                  <Sparkles className="h-5 w-5 text-white opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
