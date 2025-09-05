import sgMail from '@sendgrid/mail'
import jsPDF from 'jspdf'
import { CleaningOrder } from '@/types'
import { calculatePrice } from './utils'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function sendOrderConfirmation(order: CleaningOrder) {
  const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/track/${order.tracking_id}`
  
  const msg = {
    to: order.email,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: 'Potwierdzenie zgłoszenia - ProPorządek Żywiec',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0ea5e9; color: white; padding: 20px; text-align: center;">
          <h1>ProPorządek Żywiec</h1>
          <p>Dziękujemy za zgłoszenie!</p>
        </div>
        
        <div style="padding: 20px;">
          <h2>Szczegóły Twojego zlecenia</h2>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Imię i nazwisko:</strong> ${order.first_name} ${order.last_name}</p>
            <p><strong>Typ sprzątania:</strong> ${order.cleaning_type}</p>
            <p><strong>Metraż:</strong> ${order.square_meters} m²</p>
            <p><strong>Adres:</strong> ${order.address}</p>
            <p><strong>Preferowany termin:</strong> ${new Date(order.preferred_date).toLocaleDateString('pl-PL')}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
          
          <div style="background-color: #ecfdf5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #065f46; margin-top: 0;">Numer śledzenia</h3>
            <p style="font-size: 18px; font-weight: bold; color: #065f46;">${order.tracking_id}</p>
            <p>Możesz śledzić status swojego zlecenia pod adresem:</p>
            <a href="${trackingUrl}" style="color: #0ea5e9; text-decoration: none;">${trackingUrl}</a>
          </div>
          
          <p>Skontaktujemy się z Tobą w ciągu 24 godzin z ofertą cenową i potwierdzeniem terminu.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p><strong>Kontakt:</strong></p>
            <p>Telefon: +48 880 118 995</p>
            <p>E-mail: piotrulaa@protonmail.com</p>
          </div>
        </div>
      </div>
    `
  }

  try {
    await sgMail.send(msg)
    console.log('Order confirmation email sent successfully')
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    throw error
  }
}

export async function sendQuotePDF(order: CleaningOrder) {
  // Generate PDF quote
  const pdf = new jsPDF()
  const price = calculatePrice(order.cleaning_type, order.square_meters)
  
  // PDF Header
  pdf.setFontSize(20)
  pdf.text('ProPorządek Żywiec', 20, 30)
  pdf.setFontSize(14)
  pdf.text('Oferta cenowa', 20, 45)
  
  // Order details
  pdf.setFontSize(12)
  let yPosition = 70
  
  pdf.text(`Klient: ${order.first_name} ${order.last_name}`, 20, yPosition)
  yPosition += 10
  pdf.text(`Adres: ${order.address}`, 20, yPosition)
  yPosition += 10
  pdf.text(`Typ sprzątania: ${order.cleaning_type}`, 20, yPosition)
  yPosition += 10
  pdf.text(`Metraż: ${order.square_meters} m²`, 20, yPosition)
  yPosition += 10
  pdf.text(`Preferowany termin: ${new Date(order.preferred_date).toLocaleDateString('pl-PL')}`, 20, yPosition)
  
  yPosition += 20
  pdf.setFontSize(14)
  pdf.text(`Cena: ${price} zł`, 20, yPosition)
  
  yPosition += 20
  pdf.setFontSize(10)
  pdf.text('Oferta ważna przez 30 dni.', 20, yPosition)
  pdf.text('Cena może ulec zmianie w zależności od stanu obiektu.', 20, yPosition + 10)
  
  // Convert PDF to base64
  const pdfBase64 = pdf.output('datauristring').split(',')[1]
  
  const msg = {
    to: order.email,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: 'Oferta cenowa - ProPorządek Żywiec',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0ea5e9; color: white; padding: 20px; text-align: center;">
          <h1>ProPorządek Żywiec</h1>
          <p>Oferta cenowa</p>
        </div>
        
        <div style="padding: 20px;">
          <h2>Szanowny/a ${order.first_name} ${order.last_name},</h2>
          
          <p>W załączeniu przesyłamy ofertę cenową dla Twojego zlecenia sprzątania.</p>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Podsumowanie:</h3>
            <p><strong>Typ sprzątania:</strong> ${order.cleaning_type}</p>
            <p><strong>Metraż:</strong> ${order.square_meters} m²</p>
            <p><strong>Cena:</strong> ${price} zł</p>
          </div>
          
          <p>Aby potwierdzić zlecenie, prosimy o kontakt telefoniczny lub e-mailowy.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p><strong>Kontakt:</strong></p>
            <p>Telefon: +48 880 118 995</p>
            <p>E-mail: piotrulaa@protonmail.com</p>
          </div>
        </div>
      </div>
    `,
    attachments: [
      {
        content: pdfBase64,
        filename: `oferta_${order.tracking_id}.pdf`,
        type: 'application/pdf',
        disposition: 'attachment'
      }
    ]
  }

  try {
    await sgMail.send(msg)
    console.log('Quote PDF email sent successfully')
  } catch (error) {
    console.error('Error sending quote PDF email:', error)
    throw error
  }
}

export async function sendContactForm(formData: {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}) {
  const msg = {
    to: process.env.SENDGRID_FROM_EMAIL!,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: `Nowa wiadomość z formularza kontaktowego - ${formData.subject || 'Brak tematu'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Nowa wiadomość z formularza kontaktowego</h2>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Imię i nazwisko:</strong> ${formData.name}</p>
          <p><strong>E-mail:</strong> ${formData.email}</p>
          ${formData.phone ? `<p><strong>Telefon:</strong> ${formData.phone}</p>` : ''}
          ${formData.subject ? `<p><strong>Temat:</strong> ${formData.subject}</p>` : ''}
        </div>
        
        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
          <h3>Wiadomość:</h3>
          <p>${formData.message.replace(/\n/g, '<br>')}</p>
        </div>
      </div>
    `
  }

  try {
    await sgMail.send(msg)
    console.log('Contact form email sent successfully')
  } catch (error) {
    console.error('Error sending contact form email:', error)
    throw error
  }
}
