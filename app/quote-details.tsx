import { useState, useEffect } from 'react'
import { SafeAreaView, View, Text, TextInput, Pressable, StyleSheet, ScrollView, Switch } from 'react-native'
import { router } from 'expo-router'
import StepHeader from '../components/StepHeader'
import { useRFQ } from '../lib/RFQContext'
import { SUPPLIERS, SupplierEntry } from '../lib/suppliers'

export default function QuoteDetailsScreen() {
  const rfq = useRFQ()
  const DEFAULT_SANDBOX = "Sandbox — Test with your own email"
  const [supplierQuery, setSupplierQuery] = useState(rfq.supplier.supplierName || DEFAULT_SANDBOX)
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    if (!rfq.supplier.supplierName) {
      rfq.setSupplier({ supplierName: DEFAULT_SANDBOX, supplierEmail: rfq.builder.email, accountNumber: "" });
      setSupplierQuery(DEFAULT_SANDBOX);
    }
  }, []);

  const filtered = supplierQuery.trim().length >= 2
    ? SUPPLIERS.filter(s => !s.hidden && s.name.toLowerCase().includes(supplierQuery.toLowerCase())).slice(0, 6)
    : []

  function selectSupplier(s: SupplierEntry) {
    setSupplierQuery(s.name)
    setShowSuggestions(false)
    const isSandbox = s.sandbox
    rfq.setSupplier({
      supplierName: s.name,
      supplierEmail: isSandbox ? rfq.builder.email : s.email,
      accountNumber: rfq.supplier.accountNumber,
    })
  }

  function handleSend() {
    router.push('/sent')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StepHeader step={3} />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>

          <Text style={styles.sectionTitle}>Your Details</Text>

          <TextInput
            placeholder="Builder Name"
            value={rfq.builder.builderName}
            onChangeText={v => rfq.setBuilder({ ...rfq.builder, builderName: v })}
            style={styles.input}
          />
          <TextInput
            placeholder="Company Name"
            value={rfq.builder.company}
            onChangeText={v => rfq.setBuilder({ ...rfq.builder, company: v })}
            style={styles.input}
          />
          <TextInput
            placeholder="ABN / ACN"
            value={rfq.builder.abn}
            onChangeText={v => rfq.setBuilder({ ...rfq.builder, abn: v })}
            style={styles.input}
          />
          <TextInput
            placeholder="Phone"
            value={rfq.builder.phone}
            onChangeText={v => rfq.setBuilder({ ...rfq.builder, phone: v })}
            keyboardType="phone-pad"
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={rfq.builder.email}
            onChangeText={v => rfq.setBuilder({ ...rfq.builder, email: v })}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <Text style={styles.sectionTitle}>Supplier</Text>

          <TextInput
            placeholder="Start typing supplier name..."
            value={supplierQuery}
            onChangeText={v => {
              setSupplierQuery(v)
              setShowSuggestions(true)
              rfq.setSupplier({ ...rfq.supplier, supplierName: v })
            }}
            onFocus={() => { if (supplierQuery.length >= 2) setShowSuggestions(true) }}
            style={styles.input}
          />

          {showSuggestions && filtered.length > 0 ? (
            <View style={styles.suggestions}>
              {filtered.map(s => (
                <Pressable
                  key={s.name}
                  style={styles.suggestionRow}
                  onPress={() => selectSupplier(s)}
                >
                  <Text style={styles.suggestionName}>{s.name}</Text>
                  <Text style={styles.suggestionDetail}>
                    {s.sandbox ? 'Sends to your own email for testing' : s.email}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          <TextInput
            placeholder="Supplier Email"
            value={rfq.supplier.supplierEmail}
            onChangeText={v => rfq.setSupplier({ ...rfq.supplier, supplierEmail: v })}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            placeholder="Account Number (if known)"
            value={rfq.supplier.accountNumber}
            onChangeText={v => rfq.setSupplier({ ...rfq.supplier, accountNumber: v })}
            style={styles.input}
          />

          <Text style={styles.sectionTitle}>Project</Text>

          <TextInput
            placeholder="Project Reference (e.g. Smith Residence)"
            value={rfq.projectReference}
            onChangeText={rfq.setProjectReference}
            style={styles.input}
          />

          <Text style={styles.sectionTitle}>Delivery</Text>

          <View style={styles.toggleRow}>
            <Pressable
              style={[styles.toggleBtn, rfq.delivery === 'delivery' && styles.toggleActive]}
              onPress={() => rfq.setDelivery('delivery')}
            >
              <Text style={[styles.toggleText, rfq.delivery === 'delivery' && styles.toggleTextActive]}>Delivery</Text>
            </Pressable>
            <Pressable
              style={[styles.toggleBtn, rfq.delivery === 'pickup' && styles.toggleActive]}
              onPress={() => rfq.setDelivery('pickup')}
            >
              <Text style={[styles.toggleText, rfq.delivery === 'pickup' && styles.toggleTextActive]}>Pick-up</Text>
            </Pressable>
          </View>

          {rfq.delivery === 'delivery' ? (
            <>
              <TextInput
                placeholder="Site Address"
                value={rfq.siteAddress}
                onChangeText={rfq.setSiteAddress}
                style={styles.input}
              />
              <TextInput
                placeholder="Suburb"
                value={rfq.siteSuburb}
                onChangeText={rfq.setSiteSuburb}
                style={styles.input}
              />
            </>
          ) : null}

          <Text style={styles.sectionTitle}>Message</Text>

          <TextInput
            placeholder="Any notes for supplier..."
            value={rfq.message}
            onChangeText={rfq.setMessage}
            multiline
            style={[styles.input, styles.textArea]}
          />

          <Text style={styles.sectionTitle}>Send Options</Text>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Send RFQ to Supplier</Text>
            <Switch
              value={rfq.sendToSupplier}
              onValueChange={rfq.setSendToSupplier}
              trackColor={{ true: '#F47A20' }}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Send a copy to myself</Text>
            <Switch
              value={rfq.sendCopyToSelf}
              onValueChange={rfq.setSendCopyToSelf}
              trackColor={{ true: '#F47A20' }}
            />
          </View>

          <Pressable
            style={[styles.primaryButton, !rfq.builder.email && styles.buttonDisabled]}
            onPress={handleSend}
            disabled={!rfq.builder.email}
          >
            <Text style={styles.primaryButtonText}>Send RFQ →</Text>
          </Pressable>

          <Pressable onPress={() => router.back()}>
            <Text style={styles.back}>← Back</Text>
          </Pressable>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F4F6F8' },
  scrollContent: { paddingBottom: 30 },
  container: { padding: 20, gap: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginTop: 10, color: '#1F2A37' },
  input: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#D2DBE1', fontSize: 15, color: '#22313F',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  suggestions: {
    backgroundColor: '#FFFFFF', borderRadius: 14,
    borderWidth: 1, borderColor: '#D2DBE1', overflow: 'hidden',
  },
  suggestionRow: {
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#EEF2F5',
  },
  suggestionName: { fontSize: 15, fontWeight: '600', color: '#22313F' },
  suggestionDetail: { fontSize: 12, color: '#7B8794', marginTop: 2 },
  toggleRow: { flexDirection: 'row', gap: 10 },
  toggleBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#D2DBE1', alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  toggleActive: { borderColor: '#F47A20', backgroundColor: '#FFF4E8' },
  toggleText: { fontSize: 15, fontWeight: '700', color: '#6B7A88' },
  toggleTextActive: { color: '#F47A20' },
  switchRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 4,
  },
  switchLabel: { fontSize: 15, color: '#22313F', fontWeight: '600' },
  primaryButton: {
    backgroundColor: '#F47A20', padding: 18,
    borderRadius: 18, alignItems: 'center', marginTop: 20,
  },
  buttonDisabled: { opacity: 0.5 },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  back: { marginTop: 12, textAlign: 'center', color: '#445C70' },
})
