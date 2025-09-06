import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import TrackingPanel from '@/components/TrackingPanel'

interface TrackingPageProps {
  params: {
    trackingId: string
  }
}

export default function TrackingPage({ params }: TrackingPageProps) {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-24 section-padding">
        <div className="container-custom">
          <TrackingPanel trackingId={params.trackingId} />
        </div>
      </div>
      <Footer />
    </main>
  )
}
