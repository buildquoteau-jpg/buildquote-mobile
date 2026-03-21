import { useState } from 'react'
import { SafeAreaView, View, Text, Pressable, StyleSheet, Image, ScrollView, Alert, ActivityIndicator } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import StepHeader from '../components/StepHeader'
import { useRFQ } from '../lib/RFQContext'

const API_BASE = 'https://buildquote.com.au'

const LOADING_MESSAGES = [
  'Reading your list...',
  'Identifying the items...',
  'Organising your lines...',
  'Checking quantities...',
  'Almost done...',
]

type SelectedFile = {
  name: string
  uri: string
  mimeType: string
  size?: string
  kind: 'photo' | 'document'
}

export default function CaptureScreen() {
  const { setItems } = useRFQ()
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [msgIndex, setMsgIndex] = useState(0)

  async function parseFile() {
    if (!selectedFile) return

    setLoading(true)
    setError('')
    setMsgIndex(0)

    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % LOADING_MESSAGES.length)
    }, 2800)

    try {
      const formData = new FormData()
      formData.append('file', {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.mimeType,
      } as any)

      const res = await fetch(`${API_BASE}/api/parse`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || 'Parse failed')
      }

      if (!data.items || data.items.length === 0) {
        throw new Error(
          "We couldn't find any items in your file. Tips: make sure your list is clearly written, one item per line, with quantities if possible. Photos work best in good lighting with clear handwriting."
        )
      }

      setItems(data.items)
      router.push('/details')
    } catch (err: any) {
      setError(
        err?.message ||
        'Something went wrong reading your file. Try a clearer photo or a different file format.'
      )
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  async function pickFromCamera() {
    const perm = await ImagePicker.requestCameraPermissionsAsync()
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Camera access is required to take photos.')
      return
    }

    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    })

    if (res.canceled) return
    const file = res.assets?.[0]
    if (!file?.uri) return

    setSelectedFile({
      name: file.fileName ?? 'photo.jpg',
      uri: file.uri,
      mimeType: file.mimeType ?? 'image/jpeg',
      kind: 'photo',
    })
    setError('')
  }

  async function pickFromLibrary() {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    })

    if (res.canceled) return
    const file = res.assets?.[0]
    if (!file?.uri) return

    setSelectedFile({
      name: file.fileName ?? 'image.jpg',
      uri: file.uri,
      mimeType: file.mimeType ?? 'image/jpeg',
      kind: 'photo',
    })
    setError('')
  }

  async function pickDocument() {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: false,
      copyToCacheDirectory: true,
      type: '*/*',
    })

    if (result.canceled) return
    const file = result.assets?.[0]
    if (!file?.uri) return

    setSelectedFile({
      name: file.name ?? 'document',
      uri: file.uri,
      mimeType: file.mimeType ?? 'application/octet-stream',
      size: file.size ? String(file.size) : '',
      kind: 'document',
    })
    setError('')
  }

  function handleUpload() {
    Alert.alert('Add materials', 'Choose how you want to upload your list', [
      { text: 'Take photo', onPress: pickFromCamera },
      { text: 'Choose photo', onPress: pickFromLibrary },
      { text: 'Choose document', onPress: pickDocument },
      { text: 'Cancel', style: 'cancel' },
    ])
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StepHeader step={1} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.hero}>
            <Text style={styles.title}>Create your quote request</Text>
            <Text style={styles.subtitle}>
              Choose how to add your materials — the best way for you
            </Text>
          </View>

          {error ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.card}>
            <View style={styles.optionTop}>
              <Text style={styles.optionLabel}>OPTION 1</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>MOST POPULAR</Text>
              </View>
            </View>

            <Text style={styles.cardTitle}>Upload a materials list</Text>

            <View style={styles.imageWrap}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1200&q=80' }}
                style={styles.preview}
                resizeMode="cover"
              />
            </View>

            <View style={styles.chipRow}>
              <View style={styles.chip}><Text style={styles.chipText}>Handwritten list</Text></View>
              <View style={styles.chip}><Text style={styles.chipText}>PDF / BOM</Text></View>
              <View style={styles.chip}><Text style={styles.chipText}>Takeoff CSV</Text></View>
            </View>

            <Text style={styles.cardBody}>Photos, PDFs, CSVs — we'll sort it out.</Text>

            {selectedFile ? (
              <View style={styles.selectedWrap}>
                <Text style={styles.selectedLabel}>
                  {selectedFile.kind === 'photo' ? 'Photo selected' : '1 file selected'}
                </Text>
                <Text style={styles.selectedName} numberOfLines={2}>
                  {selectedFile.name}
                </Text>
              </View>
            ) : null}

            <Pressable
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={selectedFile ? parseFile : handleUpload}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? LOADING_MESSAGES[msgIndex] : selectedFile ? 'Read my list' : 'Choose file or photo'}
              </Text>
            </Pressable>

            {selectedFile && !loading ? (
              <Pressable style={styles.changeButton} onPress={handleUpload}>
                <Text style={styles.changeButtonText}>Change file</Text>
              </Pressable>
            ) : null}
          </View>

          <View style={styles.card}>
            <Text style={styles.optionLabel}>OPTION 2</Text>
            <Text style={styles.cardTitle}>Add items manually</Text>

            <View style={styles.manualMock}>
              <View style={styles.mockLineLong} />
              <View style={styles.mockRow}>
                <View style={styles.mockLineShort} />
                <View style={styles.mockLineShort} />
              </View>
            </View>

            <Text style={styles.cardBody}>Type what you need while you're still on site.</Text>
            <Text style={styles.cardHint}>No file? No worries.</Text>

            <Pressable style={styles.secondaryButton} onPress={() => router.push('/details')}>
              <Text style={styles.secondaryButtonText}>Add items manually</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {loading ? (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#185D7A" />
            <Text style={styles.loadingTitle}>{LOADING_MESSAGES[msgIndex]}</Text>
            <Text style={styles.loadingSubtitle}>This usually takes 15–30 seconds</Text>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F4F6F8' },
  scrollContent: { paddingBottom: 28 },
  container: { padding: 20, gap: 22 },
  hero: { gap: 10, paddingTop: 8 },
  title: { fontSize: 24, lineHeight: 32, fontWeight: '800', color: '#1F5F7C' },
  subtitle: { fontSize: 16, lineHeight: 23, color: '#3F4F5F' },
  errorCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 14,
  },
  errorText: { fontSize: 14, lineHeight: 20, color: '#991B1B', fontWeight: '600' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#C9D4DB',
    padding: 18,
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  optionTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  optionLabel: {
    fontSize: 12, lineHeight: 16, fontWeight: '700',
    letterSpacing: 2, color: '#69B8A7',
  },
  badge: {
    backgroundColor: '#F47A20',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  cardTitle: { fontSize: 18, lineHeight: 24, fontWeight: '800', color: '#1F5F7C' },
  imageWrap: { borderRadius: 18, overflow: 'hidden', backgroundColor: '#EEF3F6' },
  preview: { width: '100%', height: 170 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#E8F0F2',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipText: { fontSize: 12, fontWeight: '700', color: '#446273' },
  cardBody: { fontSize: 16, lineHeight: 22, color: '#566575' },
  cardHint: { fontSize: 13, lineHeight: 20, color: '#7A8794' },
  selectedWrap: {
    borderWidth: 1, borderColor: '#D7E0E5', backgroundColor: '#F7F9FA',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
  },
  selectedLabel: {
    fontSize: 12, lineHeight: 16, fontWeight: '700',
    letterSpacing: 1, color: '#69B8A7',
    textTransform: 'uppercase', marginBottom: 4,
  },
  selectedName: { fontSize: 15, lineHeight: 21, color: '#1F5F7C', fontWeight: '600' },
  primaryButton: {
    backgroundColor: '#F47A20',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  changeButton: {
    borderWidth: 1.5, borderColor: '#F47A20',
    borderRadius: 16, paddingVertical: 16, alignItems: 'center',
  },
  changeButtonText: { color: '#F47A20', fontSize: 16, fontWeight: '800' },
  secondaryButton: {
    borderWidth: 1.5, borderColor: '#69B8A7',
    borderRadius: 16, paddingVertical: 16, alignItems: 'center',
  },
  secondaryButtonText: { color: '#1F5F7C', fontSize: 16, fontWeight: '800' },
  manualMock: {
    backgroundColor: '#F7F9FA', borderRadius: 18,
    borderWidth: 1, borderColor: '#D7E0E5', padding: 12, gap: 10,
  },
  mockLineLong: {
    height: 42, borderRadius: 14, backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#D7E0E5',
  },
  mockRow: { flexDirection: 'row', gap: 10 },
  mockLineShort: {
    flex: 1, height: 42, borderRadius: 14, backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#D7E0E5',
  },
  loadingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center', alignItems: 'center', zIndex: 50,
  },
  loadingCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1,
    borderColor: '#D2DBE1', paddingHorizontal: 28, paddingVertical: 32,
    alignItems: 'center', gap: 16, width: '85%',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 }, elevation: 8,
  },
  loadingTitle: { fontSize: 18, fontWeight: '800', color: '#185D7A', textAlign: 'center' },
  loadingSubtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
})
