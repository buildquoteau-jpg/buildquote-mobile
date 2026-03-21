import { useState, useEffect } from 'react'
import { SafeAreaView, View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import StepHeader from '../components/StepHeader'
import { useRFQ } from '../lib/RFQContext'

const API_BASE = 'https://buildquote.com.au'

function generateRFQId(): string {
  const now = new Date()
  const d = now.toISOString().slice(2, 10).replace(/-/g, '')
  const r = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `RFQ-${d}-${r}`
}

export default function SentScreen() {
  const rfq = useRFQ()
  const [sending, setSending] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [rfqId, setRfqId] = useState('')

  useEffect(() => {
    sendRFQ()
  }, [])

  async function sendRFQ() {
    const id = generateRFQId()
    setRfqId(id)
    setSending(true)
    setError('')

    try {
      // Strip Unicode chars that break PDF generation (WinAnsi encoding)
      const sanitize = (s: string) => s.replace(/[^\x00-\x7F]/g, m => {
        if (m === "\u2014" || m === "\u2013") return "-";
        if (m === "\u2018" || m === "\u2019") return "\x27";
        if (m === "\u201C" || m === "\u201D") return "\x22";
        if (m === "\u2022") return "-";
        return "";
      });
      const cleanItems = rfq.items.map(item => ({
        ...item,
        name: sanitize(item.name),
        desc: sanitize(item.desc),
        sku: sanitize(item.sku),
        uom: sanitize(item.uom),
      }));
      const cleanSupplier = {
        ...rfq.supplier,
        supplierName: sanitize(rfq.supplier.supplierName),
      };
      const payload = {
        rfqId: id,
        builder: rfq.builder,
        supplier: cleanSupplier,
        items: cleanItems,
        delivery: rfq.delivery,
        dateRequired: rfq.dateRequired,
        message: rfq.message,
        projectReference: rfq.projectReference,
        siteAddress: rfq.siteAddress,
        siteSuburb: rfq.siteSuburb,
        sendToSupplier: rfq.sendToSupplier,
        sendCopyToSelf: rfq.sendCopyToSelf,
      }

      const res = await fetch(`${API_BASE}/api/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || 'Send failed')
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err?.message || 'Something went wrong sending your RFQ. Please try again.')
    } finally {
      setSending(false)
    }
  }

  function handleNewRFQ() {
    rfq.resetAll()
    router.replace('/')
  }

  if (sending) {
    return (
      <SafeAreaView style={styles.safe}>
        <StepHeader step={4} />
        <View style={styles.centerContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#185D7A" />
            <Text style={styles.loadingTitle}>Sending your RFQ...</Text>
            <Text style={styles.loadingSubtitle}>
              Emailing to {rfq.supplier.supplierName || 'supplier'}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <StepHeader step={4} />
        <View style={styles.centerContainer}>
          <View style={styles.card}>
            <Text style={styles.errorTitle}>Send failed</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.primaryButton} onPress={sendRFQ}>
              <Text style={styles.primaryButtonText}>Try again</Text>
            </Pressable>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.back}>← Back to edit</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StepHeader step={4} />
      <View style={styles.centerContainer}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>STEP 4</Text>
          <Text style={styles.title}>RFQ sent ✓</Text>
          <Text style={styles.subtitle}>
            Your request for quote has been sent to {rfq.supplier.supplierName || 'the supplier'}.
          </Text>

          <View style={styles.refCard}>
            <Text style={styles.refLabel}>Reference</Text>
            <Text style={styles.refValue}>{rfqId}</Text>
          </View>

          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>What happens next</Text>
            <Text style={styles.statusText}>• Supplier receives your RFQ with PDF and CSV</Text>
            <Text style={styles.statusText}>• They reply directly to {rfq.builder.email || 'your email'}</Text>
            <Text style={styles.statusText}>• Review their quote and confirm before ordering</Text>
          </View>

          <Pressable style={styles.primaryButton} onPress={handleNewRFQ}>
            <Text style={styles.primaryButtonText}>Start a new RFQ</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
            <Text style={styles.secondaryButtonText}>Back</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F4F6F8' },
  centerContainer: { flex: 1, padding: 20, justifyContent: 'center' },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 24,
    borderWidth: 1, borderColor: '#D2DBE1', padding: 22, gap: 16,
  },
  eyebrow: { fontSize: 12, fontWeight: '800', letterSpacing: 2, color: '#69B8A7' },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '800', color: '#1F5F7C' },
  subtitle: { fontSize: 16, lineHeight: 23, color: '#435260' },
  refCard: {
    backgroundColor: '#F0F7FA', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#D2DBE1',
  },
  refLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1, color: '#7A8A99', textTransform: 'uppercase' },
  refValue: { fontSize: 17, fontWeight: '800', color: '#185D7A', marginTop: 4 },
  statusCard: {
    backgroundColor: '#F8FBFC', borderRadius: 18,
    borderWidth: 1, borderColor: '#DCE7EC', padding: 16, gap: 8,
  },
  statusTitle: { fontSize: 16, fontWeight: '800', color: '#1F2A37' },
  statusText: { fontSize: 15, lineHeight: 21, color: '#435260' },
  primaryButton: {
    backgroundColor: '#F47A20', borderRadius: 18,
    paddingVertical: 18, alignItems: 'center', marginTop: 4,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  secondaryButton: {
    borderWidth: 1.5, borderColor: '#69B8A7', borderRadius: 18,
    paddingVertical: 18, alignItems: 'center', backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: { fontSize: 16, fontWeight: '800', color: '#1F5F7C' },
  loadingCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1,
    borderColor: '#D2DBE1', padding: 32, alignItems: 'center', gap: 16,
  },
  loadingTitle: { fontSize: 18, fontWeight: '800', color: '#185D7A' },
  loadingSubtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  errorTitle: { fontSize: 22, fontWeight: '800', color: '#991B1B' },
  errorText: { fontSize: 15, lineHeight: 22, color: '#991B1B' },
  back: { marginTop: 12, textAlign: 'center', color: '#445C70', fontSize: 15 },
})
