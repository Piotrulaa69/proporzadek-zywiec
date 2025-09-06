import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function ContactSection() {
  const contactInfo = [
    {
      icon: Phone,
      title: 'Telefon',
      details: ['+48 880 118 995'],
      action: 'tel:+48880118995'
    },
    {
      icon: Mail,
      title: 'E-mail',
      details: ['proporzadekzywiec@gmail.com'],
      action: 'mailto:proporzadekzywiec@gmail.com'
    },
    {
      icon: MapPin,
      title: 'Adres',
      details: ['ul. Św. Marcina 69', '34-381 Radziechowy'],
      action: 'https://maps.google.com/maps?q=ul.+Św.+Marcina+69,+34-381+Radziechowy,+Poland'
    },
    {
      icon: Clock,
      title: 'Godziny pracy',
      details: ['Pon-Pt: 8:00 - 18:00', 'Sob: 9:00 - 15:00'],
      action: null
    }
  ]

  return (
    <section id="contact" className="bg-white section-padding">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Skontaktuj się z nami
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Skorzystaj z kalkulatora cen lub przejdź do formularza zamówienia. 
            Odpowiemy w ciągu 24 godzin i pomożemy dobrać najlepsze rozwiązanie.
          </p>
        </div>

        {/* Contact Information - Centered */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="bg-primary-100 p-4 rounded-lg w-16 h-16 flex items-center justify-center mx-auto">
                  <info.icon className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{info.title}</h4>
                  <div className="space-y-1">
                    {info.details.map((detail, detailIndex) => (
                      <div key={detailIndex}>
                        {info.action ? (
                          <a
                            href={info.action}
                            className="text-gray-600 hover:text-primary-600 transition-colors block"
                            target={info.action.startsWith('http') ? '_blank' : undefined}
                            rel={info.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {detail}
                          </a>
                        ) : (
                          <span className="text-gray-600 block">{detail}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
          
        {/* Google Maps Embed - Centered */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="rounded-xl overflow-hidden h-64 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1854.158417492159!2d19.125181656310456!3d49.64662698386623!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471425c9c94f0bdf%3A0x94df1b6d9bf533c4!2s%C5%9Awi%C4%99tego%20Marcina%2069%2C%2034-381%20Radziechowy!5e1!3m2!1spl!2spl!4v1757017510629!5m2!1spl!2spl"
              width="100%"
              height="256"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokalizacja ProPorządek Żywiec - ul. Św. Marcina 69, Radziechowy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}
