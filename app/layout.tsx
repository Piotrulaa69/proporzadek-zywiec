import type { Metadata } from 'next'
import './globals.css'
import WhatsAppWidget from '@/components/WhatsAppWidget'

export const metadata: Metadata = {
  title: 'ProPorządek Żywiec - Profesjonalne Usługi Sprzątania',
  description: 'Profesjonalne usługi sprzątania w Żywcu, Radziechowach i okolicach. Sprzątanie mieszkań, domów, biur i po remontach. Doświadczeni specjaliści, konkurencyjne ceny. Tel: +48 880 118 995',
  keywords: 'sprzątanie Żywiec, sprzątanie Radziechowy, usługi sprzątania, sprzątanie mieszkań, sprzątanie biur, sprzątanie po remoncie, sprzątanie głębokie, firma sprzątająca Żywiec, ProPorządek',
  authors: [{ name: 'ProPorządek Żywiec' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'ProPorządek Żywiec - Profesjonalne Usługi Sprzątania',
    description: 'Profesjonalne usługi sprzątania w Żywcu, Radziechowach i okolicach. Sprzątanie mieszkań, biur i po remontach.',
    type: 'website',
    locale: 'pl_PL',
    siteName: 'ProPorządek Żywiec',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProPorządek Żywiec - Profesjonalne Usługi Sprzątania',
    description: 'Profesjonalne usługi sprzątania w Żywcu i okolicach.',
  },
  alternates: {
    canonical: 'https://proporzadek-zywiec.netlify.app'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <body className="antialiased">
        {children}
        <WhatsAppWidget />
      </body>
    </html>
  )
}
