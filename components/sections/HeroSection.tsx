'use client'

import Link from 'next/link'
import { ArrowRight, Star, Users, Clock } from 'lucide-react'

export default function HeroSection() {
  return (
    <section id="home" className="bg-gradient-to-br from-primary-50 to-white pt-20">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Profesjonalne
                <span className="text-primary-600 block">sprzątanie</span>
                w Żywcu
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Zaufaj doświadczonym specjalistom. Oferujemy kompleksowe usługi sprzątania 
                mieszkań, biur i obiektów po remontach z gwarancją jakości.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Zadowolonych klientów</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <Star className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">4.9/5</div>
                  <div className="text-sm text-gray-600">Średnia ocen</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">24h</div>
                  <div className="text-sm text-gray-600">Czas odpowiedzi</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#calculator" className="btn-primary inline-flex items-center justify-center">
                Zamów sprzątanie
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a href="#services" className="btn-secondary inline-flex items-center justify-center">
                Zobacz usługi
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="/images/hero.png"
                alt="Profesjonalne sprzątanie - ProPorządek Żywiec"
                className="rounded-2xl shadow-2xl"
                onError={(e) => {
                  // Fallback do placeholder jeśli zdjęcie nie istnieje
                  e.currentTarget.src = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                }}
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-200 rounded-full opacity-60"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary-200 rounded-full opacity-40"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
