'use client'

import { useState, useEffect } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

export default function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: 'Anna Kowalska',
      location: 'Żywiec',
      rating: 5,
      comment: 'Fantastyczna obsługa! Dziewczyny przyszły punktualnie i wykonały świetną robotę. Mieszkanie lśni czystością. Zdecydowanie polecam!',
      date: '2024-01-15',
      service: 'Sprzątanie mieszkania'
    },
    {
      id: 2,
      name: 'Marek Nowak',
      location: 'Żywiec',
      rating: 5,
      comment: 'Korzystam z usług ProPorządek już od pół roku. Zawsze profesjonalne podejście i doskonałe rezultaty. Abonament to świetna opcja!',
      date: '2024-01-10',
      service: 'Abonament miesięczny'
    },
    {
      id: 3,
      name: 'Katarzyna Wiśniewska',
      location: 'Milówka',
      rating: 5,
      comment: 'Po remoncie mieszkanie wyglądało jak po wojnie. Ekipa ProPorządek zrobiła cuda - wszystko czyste i gotowe do zamieszkania!',
      date: '2024-01-05',
      service: 'Sprzątanie po remoncie'
    },
    {
      id: 4,
      name: 'Tomasz Zieliński',
      location: 'Rajcza',
      rating: 5,
      comment: 'Sprzątanie biura na najwyższym poziomie. Pracownicy są dyskretni i bardzo dokładni. Współpraca układa się świetnie.',
      date: '2023-12-28',
      service: 'Sprzątanie biura'
    },
    {
      id: 5,
      name: 'Magdalena Krawczyk',
      location: 'Żywiec',
      rating: 5,
      comment: 'Bardzo miła obsługa i perfekcyjne wykonanie. Szczególnie doceniam mycie okien - teraz mam piękny widok na góry!',
      date: '2023-12-20',
      service: 'Sprzątanie z myciem okien'
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <section id="testimonials" className="bg-gray-50 section-padding">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Opinie naszych klientów
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sprawdź, co mówią o nas zadowoleni klienci. Ich opinie są dla nas 
            najlepszą rekomendacją i motywacją do dalszej pracy.
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="w-full flex-shrink-0">
                  <div className="bg-white p-8 md:p-12 shadow-xl">
                    <div className="flex flex-col items-center text-center space-y-6">
                      {/* Quote Icon */}
                      <div className="bg-primary-100 p-3 rounded-full">
                        <Quote className="h-8 w-8 text-primary-600" />
                      </div>

                      {/* Rating */}
                      <div className="flex space-x-1">
                        {renderStars(testimonial.rating)}
                      </div>

                      {/* Comment */}
                      <blockquote className="text-lg md:text-xl text-gray-700 italic max-w-2xl">
                        "{testimonial.comment}"
                      </blockquote>

                      {/* Author Info */}
                      <div className="space-y-2">
                        <div className="font-semibold text-gray-900 text-lg">
                          {testimonial.name}
                        </div>
                        <div className="text-gray-600">
                          {testimonial.location} • {testimonial.service}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(testimonial.date).toLocaleDateString('pl-PL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg transition-colors duration-200"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg transition-colors duration-200"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentSlide ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">500+</div>
            <div className="text-gray-600">Zadowolonych klientów</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">4.9/5</div>
            <div className="text-gray-600">Średnia ocen</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">98%</div>
            <div className="text-gray-600">Klientów poleca nas</div>
          </div>
        </div>
      </div>
    </section>
  )
}
