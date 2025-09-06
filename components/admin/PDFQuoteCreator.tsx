'use client'

import { useState, useEffect } from 'react'
import { CleaningOrder, AdditionalService } from '@/types'
import { X, Download, Edit3, Plus, Trash2, Sparkles } from 'lucide-react'
import jsPDF from 'jspdf'

interface PDFQuoteCreatorProps {
  order: CleaningOrder
  isOpen: boolean
  onClose: () => void
}

interface EditableService extends AdditionalService {
  isEditing?: boolean
}

export default function PDFQuoteCreator({ order, isOpen, onClose }: PDFQuoteCreatorProps) {
  const [editableOrder, setEditableOrder] = useState<CleaningOrder>(order)
  const [editableServices, setEditableServices] = useState<EditableService[]>([])
  const [newService, setNewService] = useState({ name: '', price: 0, quantity: 1 })
  const [isAddingService, setIsAddingService] = useState(false)

  useEffect(() => {
    setEditableOrder(order)
    setEditableServices(order.additional_services || [])
  }, [order])

  if (!isOpen) return null

  const calculateTotal = () => {
    const basePrice = editableOrder.service_details?.base_price || 0
    const servicesTotal = editableServices.reduce((sum, service) => 
      sum + (service.price * (service.quantity || 1)), 0
    )
    return basePrice + servicesTotal
  }

  const getCleaningTypeLabel = (type: string) => {
    const types = {
      'podstawowe': 'Sprzątanie podstawowe',
      'głębokie': 'Sprzątanie głębokie',
      'biurowe': 'Sprzątanie biurowe',
      'po_remoncie': 'Sprzątanie po remoncie'
    }
    return types[type as keyof typeof types] || type
  }

  const updateServicePrice = (index: number, newPrice: number) => {
    const updated = [...editableServices]
    updated[index].price = newPrice
    setEditableServices(updated)
  }

  const updateServiceQuantity = (index: number, newQuantity: number) => {
    const updated = [...editableServices]
    updated[index].quantity = newQuantity
    setEditableServices(updated)
  }

  const removeService = (index: number) => {
    const updated = editableServices.filter((_, i) => i !== index)
    setEditableServices(updated)
  }

  const addNewService = () => {
    if (newService.name && newService.price > 0) {
      setEditableServices([...editableServices, {
        id: Date.now().toString(),
        name: newService.name,
        price: newService.price,
        quantity: newService.quantity
      }])
      setNewService({ name: '', price: 0, quantity: 1 })
      setIsAddingService(false)
    }
  }

  // Funkcja do usuwania polskich znaków
  const removePolishChars = (text: string): string => {
    const polishChars: { [key: string]: string } = {
      'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
      'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z'
    }
    return text.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (char) => polishChars[char] || char)
  }

  const generatePDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4')
    
    // Kolory - eleganckie i profesjonalne
    const primaryColor: [number, number, number] = [59, 130, 246] // blue-500
    const darkColor: [number, number, number] = [17, 24, 39] // gray-900
    const grayColor: [number, number, number] = [107, 114, 128] // gray-500
    const lightGray: [number, number, number] = [249, 250, 251] // gray-50
    const whiteColor: [number, number, number] = [255, 255, 255]
    
    // Funkcja sprawdzania czy potrzebna nowa strona
    const checkPageBreak = (currentY: number, neededSpace: number) => {
      const pageHeight = doc.internal.pageSize.height
      if (currentY + neededSpace > pageHeight - 40) { // 40mm margines na dole
        doc.addPage()
        return 20 // Nowa pozycja Y na nowej stronie
      }
      return currentY
    }
    
    // Czyste białe tło
    doc.setFillColor(whiteColor[0], whiteColor[1], whiteColor[2])
    doc.rect(0, 0, 210, 297, 'F')
    
    // Elegancki nagłówek - białe tło z delikatnym cieniem
    doc.setFillColor(whiteColor[0], whiteColor[1], whiteColor[2])
    doc.rect(0, 0, 210, 60, 'F')
    
    // Delikatna linia pod nagłówkiem
    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2])
    doc.setLineWidth(1)
    doc.line(15, 55, 195, 55)
    
    // Logo - takie samo jak na stronie (niebieski kwadrat z ikoną)
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.roundedRect(20, 15, 20, 20, 3, 3, 'F')
    
    // Ikona Sparkles w logo
    doc.setTextColor(whiteColor[0], whiteColor[1], whiteColor[2])
    doc.setFontSize(18)
    doc.text('✨', 27, 29)
    
    // Nazwa firmy - czarna, elegancka
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text(removePolishChars('ProPorzadek Zywiec'), 50, 28)
    
    // Podtytuł - szary
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(removePolishChars('Profesjonalne uslugi sprzatania'), 50, 35)
    
    // Dane kontaktowe - mała czcionka, szare
    doc.setFontSize(9)
    doc.text('Tel: +48 880 118 995', 50, 42)
    doc.text('Email: proporzadekzywiec@gmail.com', 50, 47)
    doc.text('www.proporzadek-zywiec.pl', 50, 52)
    
    // Tytuł oferty - elegancki
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text(removePolishChars('OFERTA CENOWA'), 20, 75)
    
    // Data - po prawej stronie
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Data: ${new Date().toLocaleDateString('pl-PL')}`, 150, 75)
    
    // Elegancka linia pod tytułem
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.setLineWidth(2)
    doc.line(20, 80, 190, 80)
    
    // Sprawdź czy potrzebna nowa strona dla danych klienta
    let yPos = checkPageBreak(90, 50)
    
    // Dane klienta - tytuł
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(removePolishChars('DANE KLIENTA:'), 20, yPos)
    
    // Linia pod tytułem
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.setLineWidth(1)
    doc.line(20, yPos + 2, 190, yPos + 2)
    
    yPos += 10
    
    // Dane klienta - zawartość
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    
    doc.text(removePolishChars(`Imie i nazwisko: ${editableOrder.first_name} ${editableOrder.last_name}`), 25, yPos)
    yPos += 6
    doc.text(`Email: ${editableOrder.email}`, 25, yPos)
    yPos += 6
    doc.text(`Telefon: ${editableOrder.phone}`, 25, yPos)
    yPos += 6
    
    // Adres
    const fullAddress = editableOrder.street && editableOrder.house_number && editableOrder.postal_code && editableOrder.city
      ? `${editableOrder.street} ${editableOrder.house_number}, ${editableOrder.postal_code} ${editableOrder.city}`
      : editableOrder.address || 'Brak adresu'
    doc.text(removePolishChars(`Adres: ${fullAddress}`), 25, yPos)
    yPos += 6
    doc.text(`Termin: ${new Date(editableOrder.preferred_date).toLocaleDateString('pl-PL')}`, 25, yPos)
    
    // Sprawdź czy potrzebna nowa strona dla szczegółów usługi
    yPos = checkPageBreak(yPos + 20, 60)
    
    // Szczegóły usługi
    yPos += 20
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
    doc.text(removePolishChars('SZCZEGOLY USLUGI:'), 20, yPos)
    
    // Elegancka linia pod tytułem
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.setLineWidth(2)
    doc.line(20, yPos + 3, 190, yPos + 3)
    
    yPos += 15
    
    // Tabela z usługami - nowoczesny design
    const tableStartY = yPos
    const colWidths = [90, 25, 30, 30]
    const colPositions = [20, 110, 135, 165]
    
    // Nagłówki tabeli - eleganckie
    doc.setFillColor(darkColor[0], darkColor[1], darkColor[2])
    doc.roundedRect(20, yPos, 170, 12, 2, 2, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(whiteColor[0], whiteColor[1], whiteColor[2])
    doc.setFontSize(10)
    doc.text(removePolishChars('Usluga'), colPositions[0] + 3, yPos + 8)
    doc.text(removePolishChars('Ilosc'), colPositions[1] + 3, yPos + 8)
    doc.text('Cena jedn.', colPositions[2] + 3, yPos + 8)
    doc.text('Suma', colPositions[3] + 3, yPos + 8)
    
    yPos += 15
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
    doc.setFontSize(9)
    
    // Usługa podstawowa
    const basePrice = editableOrder.service_details?.base_price || 0
    const cleaningTypeMap = {
      'podstawowe': 'Sprzatanie podstawowe',
      'glebokie': 'Sprzatanie glebokie', 
      'biurowe': 'Sprzatanie biurowe',
      'po_remoncie': 'Sprzatanie po remoncie'
    }
    const cleaningTypeName = cleaningTypeMap[editableOrder.cleaning_type as keyof typeof cleaningTypeMap] || editableOrder.cleaning_type
    
    // Wiersz usługi podstawowej - eleganckie tło
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
    doc.roundedRect(20, yPos - 2, 170, 10, 1, 1, 'F')
    
    doc.text(removePolishChars(`${cleaningTypeName} (${editableOrder.square_meters}m2)`), colPositions[0] + 3, yPos + 4)
    doc.text('1', colPositions[1] + 3, yPos + 4)
    doc.text(`${basePrice.toFixed(0)}zl`, colPositions[2] + 3, yPos + 4)
    doc.text(`${basePrice.toFixed(0)}zl`, colPositions[3] + 3, yPos + 4)
    yPos += 12
    
    // Usługi dodatkowe
    editableServices.forEach((service, index) => {
      // Sprawdź czy potrzebna nowa strona dla każdego wiersza
      yPos = checkPageBreak(yPos, 15)
      
      const quantity = service.quantity || 1
      const total = service.price * quantity
      
      // Przemienne tło dla wierszy - eleganckie
      if (index % 2 === 0) {
        doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
        doc.roundedRect(20, yPos - 2, 170, 10, 1, 1, 'F')
      }
      
      doc.text(removePolishChars(service.name), colPositions[0] + 3, yPos + 4)
      doc.text(quantity.toString(), colPositions[1] + 3, yPos + 4)
      doc.text(`${service.price.toFixed(0)}zl`, colPositions[2] + 3, yPos + 4)
      doc.text(`${total.toFixed(0)}zl`, colPositions[3] + 3, yPos + 4)
      yPos += 12
    })
    
    // Sprawdź czy potrzebna nowa strona dla sumy
    yPos = checkPageBreak(yPos + 10, 40)
    
    // Elegancka linia oddzielająca
    yPos += 10
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.setLineWidth(2)
    doc.line(20, yPos, 190, yPos)
    
    // Suma całkowita - elegancka ramka
    yPos += 10
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.roundedRect(20, yPos, 170, 18, 3, 3, 'F')
    
    // Suma całkowita
    yPos += 12
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.setTextColor(whiteColor[0], whiteColor[1], whiteColor[2])
    const total = calculateTotal()
    doc.text(removePolishChars(`SUMA CALKOWITA: ${total.toFixed(0)}zl`), 25, yPos)
    
    // Sprawdź czy potrzebna nowa strona dla informacji dodatkowych
    yPos = checkPageBreak(yPos + 25, 50)
    
    // Informacje dodatkowe
    yPos += 25
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text(removePolishChars('INFORMACJE DODATKOWE:'), 20, yPos)
    
    // Linia pod tytułem
    doc.setDrawColor(grayColor[0], grayColor[1], grayColor[2])
    doc.setLineWidth(1)
    doc.line(20, yPos + 2, 190, yPos + 2)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    yPos += 12
    doc.text(removePolishChars('• Cena zawiera wszystkie materialy i srodki czystosci'), 25, yPos)
    yPos += 7
    doc.text(removePolishChars('• Platnosc po wykonaniu uslugi'), 25, yPos)
    yPos += 7
    doc.text(removePolishChars('• Gwarancja jakosci wykonanych uslug'), 25, yPos)
    
    if (editableOrder.additional_notes) {
      // Oblicz potrzebną wysokość dla uwag
      const notes = doc.splitTextToSize(removePolishChars(editableOrder.additional_notes), 170)
      const notesHeight = notes.length * 5 + 20 // 5mm na linię + marginesy
      
      // Sprawdź czy potrzebna nowa strona dla uwag
      yPos = checkPageBreak(yPos + 15, notesHeight)
      
      yPos += 15
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.text(removePolishChars('UWAGI KLIENTA:'), 20, yPos)
      
      // Linia pod tytułem
      doc.setDrawColor(grayColor[0], grayColor[1], grayColor[2])
      doc.setLineWidth(1)
      doc.line(20, yPos + 2, 190, yPos + 2)
      
      yPos += 8
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.text(notes, 25, yPos)
      
      // Aktualizuj pozycję Y po uwagach
      yPos += notes.length * 5
    }
    
    // Sprawdź czy potrzebna nowa strona dla stopki
    yPos = checkPageBreak(yPos + 10, 40)
    
    // Elegancka stopka - zawsze na dole strony
    const pageHeight = doc.internal.pageSize.height
    
    // Jeśli jesteśmy daleko od dołu, dodaj spację
    if (yPos < pageHeight - 50) {
      yPos = pageHeight - 40
    }
    
    // Delikatna linia nad stopką
    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2])
    doc.setLineWidth(1)
    doc.line(20, yPos, 190, yPos)
    
    yPos += 8
    
    // Treść stopki
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(removePolishChars('Dziekujemy za zaufanie!'), 20, yPos)
    
    yPos += 7
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(removePolishChars('ProPorzadek Zywiec - Profesjonalne uslugi sprzatania'), 20, yPos)
    
    yPos += 6
    doc.setFontSize(8)
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
    doc.text('Tel: +48 880 118 995  |  Email: proporzadekzywiec@gmail.com', 20, yPos)
    yPos += 4
    doc.text('www.proporzadek-zywiec.pl', 20, yPos)
    
    // Pobierz PDF
    const fileName = `oferta_${editableOrder.first_name}_${editableOrder.last_name}_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Kreator oferty PDF</h2>
              <p className="text-gray-600">
                {editableOrder.first_name} {editableOrder.last_name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Dane klienta */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Dane klienta</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Imię i nazwisko:</span>
                <span className="ml-2 font-medium">{editableOrder.first_name} {editableOrder.last_name}</span>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="ml-2 font-medium">{editableOrder.email}</span>
              </div>
              <div>
                <span className="text-gray-600">Telefon:</span>
                <span className="ml-2 font-medium">{editableOrder.phone}</span>
              </div>
              <div>
                <span className="text-gray-600">Termin:</span>
                <span className="ml-2 font-medium">
                  {new Date(editableOrder.preferred_date).toLocaleDateString('pl-PL')}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Adres:</span>
                <span className="ml-2 font-medium">
                  {editableOrder.street && editableOrder.house_number && editableOrder.postal_code && editableOrder.city
                    ? `${editableOrder.street} ${editableOrder.house_number}, ${editableOrder.postal_code} ${editableOrder.city}`
                    : editableOrder.address || 'Brak adresu'}
                </span>
              </div>
            </div>
          </div>

          {/* Usługa podstawowa */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Usługa podstawowa</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{getCleaningTypeLabel(editableOrder.cleaning_type)}</div>
                <div className="text-sm text-gray-600">{editableOrder.square_meters} m²</div>
              </div>
              <div className="text-right">
                <input
                  type="number"
                  value={editableOrder.service_details?.base_price || 0}
                  onChange={(e) => setEditableOrder({
                    ...editableOrder,
                    service_details: {
                      ...editableOrder.service_details!,
                      base_price: Number(e.target.value)
                    }
                  })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                />
                <span className="ml-1 text-gray-600">zł</span>
              </div>
            </div>
          </div>

          {/* Usługi dodatkowe */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Usługi dodatkowe</h3>
              <button
                onClick={() => setIsAddingService(true)}
                className="btn-secondary flex items-center text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Dodaj usługę
              </button>
            </div>

            <div className="space-y-2">
              {editableServices.map((service, index) => (
                <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{service.name}</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-600">Ilość:</span>
                      <input
                        type="number"
                        min="1"
                        value={service.quantity || 1}
                        onChange={(e) => updateServiceQuantity(index, Number(e.target.value))}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                      />
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-600">Cena:</span>
                      <input
                        type="number"
                        value={service.price}
                        onChange={(e) => updateServicePrice(index, Number(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                      />
                      <span className="text-gray-600">zł</span>
                    </div>
                    <div className="text-right min-w-[60px]">
                      <span className="font-medium">
                        {(service.price * (service.quantity || 1)).toFixed(0)}zł
                      </span>
                    </div>
                    <button
                      onClick={() => removeService(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Formularz dodawania nowej usługi */}
              {isAddingService && (
                <div className="p-3 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      placeholder="Nazwa usługi"
                      value={newService.name}
                      onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded"
                    />
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-600">Ilość:</span>
                      <input
                        type="number"
                        min="1"
                        value={newService.quantity}
                        onChange={(e) => setNewService({ ...newService, quantity: Number(e.target.value) })}
                        className="w-16 px-2 py-2 border border-gray-300 rounded text-center"
                      />
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-600">Cena:</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={newService.price || ''}
                        onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                        className="w-20 px-2 py-2 border border-gray-300 rounded text-right"
                      />
                      <span className="text-gray-600">zł</span>
                    </div>
                    <button
                      onClick={addNewService}
                      className="btn-primary text-sm"
                    >
                      Dodaj
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingService(false)
                        setNewService({ name: '', price: 0, quantity: 1 })
                      }}
                      className="btn-secondary text-sm"
                    >
                      Anuluj
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Suma całkowita */}
          <div className="bg-primary-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Suma całkowita:</h3>
              <div className="text-2xl font-bold text-primary-600">
                {calculateTotal().toFixed(0)}zł
              </div>
            </div>
          </div>

          {/* Uwagi */}
          {editableOrder.additional_notes && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Uwagi klienta:</h3>
              <p className="text-gray-700">{editableOrder.additional_notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Anuluj
          </button>
          <button
            onClick={generatePDF}
            className="btn-primary flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Pobierz PDF
          </button>
        </div>
      </div>
    </div>
  )
}
