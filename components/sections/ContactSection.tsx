'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

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
      details: ['piotrulaa@protonmail.com'],
      action: 'mailto:piotrulaa@protonmail.com'
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
            Masz pytania? Potrzebujesz wyceny? Skontaktuj się z nami już dziś. 
            Odpowiemy w ciągu 24 godzin i pomożemy dobrać najlepsze rozwiązanie.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Dane kontaktowe
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary-100 p-3 rounded-lg">
                        <info.icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">{info.title}</h4>
                    </div>
                    <div className="ml-12 space-y-1">
                      {info.details.map((detail, detailIndex) => (
                        <div key={detailIndex}>
                          {info.action ? (
                            <a
                              href={info.action}
                              className="text-gray-600 hover:text-primary-600 transition-colors"
                            >
                              {detail}
                            </a>
                          ) : (
                            <span className="text-gray-600">{detail}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Maps Embed */}
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

          {/* Contact Form */}
          <div className="card p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Wyślij wiadomość
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="form-label">
                    Imię i nazwisko *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Jan Kowalski"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="form-label">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="+48 880 118 995"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="form-label">
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
                <label htmlFor="subject" className="form-label">
                  Temat
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Wybierz temat</option>
                  <option value="wycena">Prośba o wycenę</option>
                  <option value="mieszkanie">Sprzątanie mieszkania</option>
                  <option value="biuro">Sprzątanie biura</option>
                  <option value="remont">Sprzątanie po remoncie</option>
                  <option value="abonament">Abonament</option>
                  <option value="inne">Inne</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="form-label">
                  Wiadomość *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="form-input resize-none"
                  placeholder="Opisz swoje potrzeby..."
                />
              </div>

              {/* Submit Status */}
              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800">
                    Dziękujemy za wiadomość! Odpowiemy w ciągu 24 godzin.
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">
                    Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Wyślij wiadomość
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
