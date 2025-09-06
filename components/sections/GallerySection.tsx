'use client'

import { useState } from 'react'
import { Eye } from 'lucide-react'

interface GalleryItem {
  id: number
  title: string
  before: string
  after: string
  description: string
  fallbackBefore?: string
  fallbackAfter?: string
}

// Galeria zdjęć przed/po - prawdziwe efekty sprzątania
const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: 'Sprzątanie domu',
    before: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80',
    after: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80',
    description: 'Kompleksowe sprzątanie domu - od kuchni po łazienkę',
    fallbackBefore: '/images/gallery/before-after-1-before.jpg',
    fallbackAfter: '/images/gallery/before-after-1-after.jpg'
  },
  {
    id: 2,
    title: 'Sprzątanie biura',
    before: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80',
    after: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80',
    description: 'Profesjonalne sprzątanie przestrzeni biurowej dla lepszej produktywności',
    fallbackBefore: '/images/gallery/before-after-2-before.jpg',
    fallbackAfter: '/images/gallery/before-after-2-after.jpg'
  },
  {
    id: 3,
    title: 'Sprzątanie po remoncie',
    before: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80',
    after: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80',
    description: 'Usunięcie kurzu budowlanego i przygotowanie mieszkania do zamieszkania',
    fallbackBefore: '/images/gallery/before-after-3-before.jpg',
    fallbackAfter: '/images/gallery/before-after-3-after.jpg'
  },
  {
    id: 4,
    title: 'Pranie tapicerki',
    before: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80',
    after: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80',
    description: 'Odzieżenie i odświeżenie mebli tapicerowanych',
    fallbackBefore: '/images/gallery/before-after-4-before.jpg',
    fallbackAfter: '/images/gallery/before-after-4-after.jpg'
  }
]

export default function GallerySection() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)

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
                      onError={(e) => {
                        if (item.fallbackBefore) {
                          e.currentTarget.src = item.fallbackBefore
                        }
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20">
                    <img
                      src={item.after}
                      alt={`${item.title} - po`}
                      className="w-1/2 h-full object-cover ml-auto"
                      onError={(e) => {
                        if (item.fallbackAfter) {
                          e.currentTarget.src = item.fallbackAfter
                        }
                      }}
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
