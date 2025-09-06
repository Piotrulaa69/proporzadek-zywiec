'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Sparkles } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: '#home', label: 'Strona główna' },
    { href: '#about', label: 'O nas' },
    { href: '#services', label: 'Usługi' },
    // { href: '#gallery', label: 'Galeria' }, // Tymczasowo ukryte
    { href: '#pricing', label: 'Cennik' },
    { href: '#testimonials', label: 'Opinie' },
    { href: '#contact', label: 'Kontakt' },
  ]

  const getNavHref = (href: string) => {
    // Jeśli jesteśmy na stronie głównej, użyj anchor link
    if (pathname === '/') {
      return href
    }
    // Jeśli jesteśmy na innej stronie, przekieruj na stronę główną z anchor
    return `/${href}`
  }

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              ProPorządek Żywiec
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={getNavHref(item.href)}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
            <a href="#calculator" className="btn-primary">
              Zamów sprzątanie
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={getNavHref(item.href)}
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <a 
                href="#calculator" 
                className="btn-primary text-center"
                onClick={() => setIsOpen(false)}
              >
                Zamów sprzątanie
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
