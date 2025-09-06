import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import OrderForm from '@/components/OrderForm'

export default function OrderPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-24 section-padding">
        <div className="container-custom">
          <OrderForm />
        </div>
      </div>
      <Footer />
    </main>
  )
}
