import { createContext, useContext, useState, ReactNode } from 'react'
import { LineItem, BuilderDetails, SupplierDetails } from './types'

interface RFQState {
  items: LineItem[]
  setItems: (items: LineItem[]) => void
  builder: BuilderDetails
  setBuilder: (b: BuilderDetails) => void
  supplier: SupplierDetails
  setSupplier: (s: SupplierDetails) => void
  delivery: 'delivery' | 'pickup'
  setDelivery: (d: 'delivery' | 'pickup') => void
  dateRequired: string
  setDateRequired: (d: string) => void
  message: string
  setMessage: (m: string) => void
  projectReference: string
  setProjectReference: (p: string) => void
  siteAddress: string
  setSiteAddress: (a: string) => void
  siteSuburb: string
  setSiteSuburb: (s: string) => void
  sendToSupplier: boolean
  setSendToSupplier: (v: boolean) => void
  sendCopyToSelf: boolean
  setSendCopyToSelf: (v: boolean) => void
  resetAll: () => void
}

const defaultBuilder: BuilderDetails = {
  builderName: '',
  company: '',
  abn: '',
  phone: '',
  email: '',
}

const defaultSupplier: SupplierDetails = {
  supplierName: '',
  supplierEmail: '',
  accountNumber: '',
}

const RFQContext = createContext<RFQState | null>(null)

export function RFQProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<LineItem[]>([])
  const [builder, setBuilder] = useState<BuilderDetails>(defaultBuilder)
  const [supplier, setSupplier] = useState<SupplierDetails>(defaultSupplier)
  const [delivery, setDelivery] = useState<'delivery' | 'pickup'>('delivery')
  const [dateRequired, setDateRequired] = useState('')
  const [message, setMessage] = useState('')
  const [projectReference, setProjectReference] = useState('')
  const [siteAddress, setSiteAddress] = useState('')
  const [siteSuburb, setSiteSuburb] = useState('')
  const [sendToSupplier, setSendToSupplier] = useState(true)
  const [sendCopyToSelf, setSendCopyToSelf] = useState(true)

  const resetAll = () => {
    setItems([])
    setBuilder(defaultBuilder)
    setSupplier(defaultSupplier)
    setDelivery('delivery')
    setDateRequired('')
    setMessage('')
    setProjectReference('')
    setSiteAddress('')
    setSiteSuburb('')
    setSendToSupplier(true)
    setSendCopyToSelf(true)
  }

  return (
    <RFQContext.Provider
      value={{
        items, setItems,
        builder, setBuilder,
        supplier, setSupplier,
        delivery, setDelivery,
        dateRequired, setDateRequired,
        message, setMessage,
        projectReference, setProjectReference,
        siteAddress, setSiteAddress,
        siteSuburb, setSiteSuburb,
        sendToSupplier, setSendToSupplier,
        sendCopyToSelf, setSendCopyToSelf,
        resetAll,
      }}
    >
      {children}
    </RFQContext.Provider>
  )
}

export function useRFQ() {
  const ctx = useContext(RFQContext)
  if (!ctx) throw new Error('useRFQ must be used within RFQProvider')
  return ctx
}
