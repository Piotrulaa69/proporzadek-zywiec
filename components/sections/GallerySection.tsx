'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'

interface GalleryItem {
  id: number
  title: string
  before: string
  after: string
  description: string
}

// Przykładowe zdjęcia - możesz zastąpić prawdziwymi
const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: 'Sprzątanie kuchni',
    before: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    description: 'Kompleksowe sprzątanie kuchni - od tłustych powierzchni do lśniących blatów'
  },
  {
    id: 2,
    title: 'Sprzątanie łazienki',
    before: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop',
    description: 'Usunięcie kamienia, pleśni i przywrócenie świeżości łazience'
  },
  {
    id: 3,
    title: 'Sprzątanie po remoncie',
    before: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    description: 'Usunięcie kurzu budowlanego i przygotowanie mieszkania do zamieszkania'
  },
  {
    id: 4,
    title: 'Sprzątanie biura',
    before: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop',
    description: 'Profesjonalne sprzątanie przestrzeni biurowej dla lepszej produktywności'
  }
]

export default function GallerySection() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextItem = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryItems.length)
  }

  const prevItem = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length)
  }

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nasze Efekty
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Zobacz jak zmieniamy przestrzenie. Każde zdjęcie to prawdziwy efekt naszej pracy.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              className="group cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative overflow-hidden rounded-xl shadow-lg">
                {/* Before/After Slider */}
                <div className="relative h-64">
                  <div className="absolute inset-0">
                    <img
                      src={item.before}
                      alt={`${item.title} - przed`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20">
                    <img
                      src={item.after}
                      alt={`${item.title} - po`}
                      className="w-1/2 h-full object-cover ml-auto"
                    />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  {/* Labels */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      PRZED
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      PO
                    </span>
                  </div>
                </div>
                
                <div className="p-4 bg-white">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={prevItem}
            className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          
          <div className="flex space-x-2">
            {galleryItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextItem}
            className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Modal */}
        {selectedItem && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedItem.title}</h3>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-red-600 mb-2">Przed</h4>
                    <img
                      src={selectedItem.before}
                      alt={`${selectedItem.title} - przed`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-green-600 mb-2">Po</h4>
                    <img
                      src={selectedItem.after}
                      alt={`${selectedItem.title} - po`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                </div>
                
                <p className="text-gray-600 mt-6 text-center">{selectedItem.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
