import Link from 'next/link'
import { Sparkles, Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">ProPorządek Żywiec</span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              Profesjonalne usługi sprzątania w Żywcu i okolicach. 
              Dbamy o czystość Twojego domu i miejsca pracy z najwyższą starannością.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">+48 880 118 995</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">proporzadekzywiec@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">ul. Św. Marcina 69, 34-381 Radziechowy</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Nasze usługi</h3>
            <ul className="space-y-2">
              <li><Link href="#services" className="text-gray-300 hover:text-primary-400 transition-colors">Sprzątanie mieszkań</Link></li>
              <li><Link href="#services" className="text-gray-300 hover:text-primary-400 transition-colors">Sprzątanie biur</Link></li>
              <li><Link href="#services" className="text-gray-300 hover:text-primary-400 transition-colors">Sprzątanie po remoncie</Link></li>
              <li><Link href="#services" className="text-gray-300 hover:text-primary-400 transition-colors">Mycie okien</Link></li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Godziny pracy</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">Pon - Pt: 8:00 - 18:00</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">Sob: 9:00 - 15:00</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">Nie: Zamknięte</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 ProPorządek Żywiec. Wszystkie prawa zastrzeżone.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/admin" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                Panel administratora
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                Polityka prywatności
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
