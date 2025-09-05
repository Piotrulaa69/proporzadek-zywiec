import { Shield, Award, Heart, Zap } from 'lucide-react'

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

          {/* Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Nasz zespół"
              className="rounded-2xl shadow-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
