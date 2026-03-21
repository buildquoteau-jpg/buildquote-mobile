import { useState } from 'react'
import { SafeAreaView, View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native'
import { router } from 'expo-router'
import StepHeader from '../components/StepHeader'
import { useRFQ } from '../lib/RFQContext'
import { LineItem } from '../lib/types'

function blankItem(): LineItem {
  return {
    id: String(Date.now()) + String(Math.random()).slice(2, 8),
    name: '', sku: '', productId: '', desc: '', uom: '', qty: '',
    confidence: 'high',
  }
}

export default function DetailsScreen() {
  const { items, setItems } = useRFQ()
  const [localItems, setLocalItems] = useState<LineItem[]>(
    items.length > 0 ? items : [blankItem()]
  )

  const lowCount = localItems.filter(i => i.confidence === 'low').length

  function update(id: string, field: keyof LineItem, value: string) {
    setLocalItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, [field]: value, ...((field === 'name' || field === 'qty') ? { confidence: 'high' as const } : {}) }
          : item
      )
    )
  }

  function removeItem(id: string) {
    if (localItems.length <= 1) {
      setLocalItems([blankItem()])
      return
    }
    setLocalItems(prev => prev.filter(item => item.id !== id))
  }

  function addItem() {
    setLocalItems(prev => [...prev, blankItem()])
  }

  function handleContinue() {
    const valid = localItems.filter(i => i.name.trim() !== '')
    if (valid.length === 0) return
    setItems(valid)
    router.push('/quote-details')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StepHeader step={2} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.hero}>
            <Text style={styles.title}>Review and edit your items</Text>
            <Text style={styles.subtitle}>
              Check anything marked for review before sending.
            </Text>
            <Text style={styles.meta}>
              {localItems.filter(i => i.name.trim()).length} item{localItems.filter(i => i.name.trim()).length !== 1 ? 's' : ''} in this draft
            </Text>
          </View>

          {lowCount > 0 ? (
            <View style={styles.noticeCard}>
              <Text style={styles.noticeTitle}>Check low-confidence fields</Text>
              <Text style={styles.noticeText}>
                {lowCount} item{lowCount !== 1 ? 's' : ''} may need a quick edit. Fields highlighted in orange were unclear.
              </Text>
            </View>
          ) : null}

          {localItems.map((item, index) => {
            const isLow = item.confidence === 'low'
            return (
              <View key={item.id} style={[styles.itemCard, isLow && styles.itemCardReview]}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemLabel}>ITEM {index + 1}</Text>
                  <View style={[styles.badge, isLow ? styles.badgeReview : styles.badgeHigh]}>
                    <Text style={[styles.badgeText, isLow ? styles.badgeReviewText : styles.badgeHighText]}>
                      {isLow ? 'Needs review' : 'High confidence'}
                    </Text>
                  </View>
                  <Pressable onPress={() => removeItem(item.id)} style={styles.removeBtn}>
                    <Text style={styles.removeBtnText}>✕</Text>
                  </Pressable>
                </View>

                <TextInput
                  value={item.name}
                  onChangeText={v => update(item.id, 'name', v)}
                  placeholder="Product name"
                  placeholderTextColor="#97A3AF"
                  style={[styles.input, isLow && styles.inputReview]}
                />
                <TextInput
                  value={item.desc}
                  onChangeText={v => update(item.id, 'desc', v)}
                  placeholder="Specs / description"
                  placeholderTextColor="#97A3AF"
                  style={[styles.input, isLow && styles.inputReview]}
                />
                <View style={styles.row}>
                  <TextInput
                    value={item.sku}
                    onChangeText={v => update(item.id, 'sku', v)}
                    placeholder="SKU"
                    placeholderTextColor="#97A3AF"
                    style={[styles.input, styles.third, isLow && styles.inputReview]}
                  />
                  <TextInput
                    value={item.uom}
                    onChangeText={v => update(item.id, 'uom', v)}
                    placeholder="UOM"
                    placeholderTextColor="#97A3AF"
                    style={[styles.input, styles.third, isLow && styles.inputReview]}
                  />
                  <TextInput
                    value={item.qty}
                    onChangeText={v => update(item.id, 'qty', v)}
                    placeholder="Qty"
                    placeholderTextColor="#97A3AF"
                    style={[styles.input, styles.third, isLow && styles.inputReview]}
                  />
                </View>

                {isLow ? (
                  <Text style={styles.reviewHint}>
                    Parser was unsure about this item. Please check the details.
                  </Text>
                ) : null}
              </View>
            )
          })}

          <Pressable style={styles.addButton} onPress={addItem}>
            <Text style={styles.addButtonLabel}>ADD ITEM</Text>
            <Text style={styles.addButtonText}>Add another item manually</Text>
          </Pressable>

          <Pressable style={styles.addButton} onPress={() => router.push('/capture')}>
            <Text style={styles.addButtonLabel}>UPLOAD</Text>
            <Text style={styles.addButtonText}>Upload another list</Text>
          </Pressable>

          <Pressable
            style={[styles.primaryButton, localItems.filter(i => i.name.trim()).length === 0 && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={localItems.filter(i => i.name.trim()).length === 0}
          >
            <Text style={styles.primaryButtonText}>Continue — add quote details →</Text>
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
  scrollContent: { paddingBottom: 28 },
  container: { padding: 20, gap: 18 },
  hero: { gap: 8, paddingTop: 8 },
  title: { fontSize: 24, lineHeight: 32, fontWeight: '800', color: '#1F5F7C' },
  subtitle: { fontSize: 16, lineHeight: 22, color: '#435260' },
  meta: { fontSize: 15, color: '#7B8794' },
  noticeCard: {
    backgroundColor: '#FFF4E8', borderRadius: 18, padding: 16,
    gap: 6, borderWidth: 1, borderColor: '#F4B266',
  },
  noticeTitle: { fontSize: 16, lineHeight: 22, fontWeight: '700', color: '#8A4B14' },
  noticeText: { fontSize: 14, lineHeight: 20, color: '#8A4B14' },
  itemCard: {
    backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16,
    gap: 12, borderWidth: 1, borderColor: '#D7DEE5',
  },
  itemCardReview: { borderColor: '#F3A64A', borderWidth: 2 },
  itemHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemLabel: { fontSize: 13, fontWeight: '800', letterSpacing: 0.7, color: '#6B7A88' },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  badgeHigh: { backgroundColor: '#E6F6EC' },
  badgeReview: { backgroundColor: '#FFF1E2' },
  badgeText: { fontSize: 12, fontWeight: '700' },
  badgeHighText: { color: '#1E7A46' },
  badgeReviewText: { color: '#B96516' },
  removeBtn: {
    marginLeft: 'auto', width: 32, height: 32, borderRadius: 10,
    borderWidth: 1, borderColor: '#D7DEE5', alignItems: 'center', justifyContent: 'center',
  },
  removeBtnText: { fontSize: 14, color: '#7B8794' },
  input: {
    backgroundColor: '#F8FAFB', borderWidth: 1, borderColor: '#D7DEE5',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 15, color: '#22313F',
  },
  inputReview: { borderColor: '#F3A64A', backgroundColor: '#FFF9F3' },
  row: { flexDirection: 'row', gap: 10 },
  third: { flex: 1 },
  reviewHint: { fontSize: 13, lineHeight: 18, color: '#9A5B1A' },
  addButton: {
    backgroundColor: '#FFFFFF', borderRadius: 16,
    borderWidth: 1, borderColor: '#D7DEE5',
    paddingVertical: 14, paddingHorizontal: 16, gap: 4,
  },
  addButtonLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8, color: '#7A8A99' },
  addButtonText: { fontSize: 15, lineHeight: 21, fontWeight: '700', color: '#22313F' },
  primaryButton: {
    backgroundColor: '#E67E22', borderRadius: 16,
    paddingVertical: 16, paddingHorizontal: 18, alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  primaryButtonText: { fontSize: 16, lineHeight: 22, fontWeight: '800', color: '#FFFFFF' },
  back: { marginTop: 12, textAlign: 'center', color: '#445C70', fontSize: 15 },
})
