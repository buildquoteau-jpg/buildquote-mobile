import { SafeAreaView, View, Text, Pressable, StyleSheet, Image, ScrollView } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import { router } from 'expo-router'
import StepHeader from '../components/StepHeader'

export default function CaptureScreen() {
  async function handleUpload() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: false,
        copyToCacheDirectory: true,
        type: '*/*',
      })

      if (result.canceled) return

      const file = result.assets?.[0]
      console.log('Picked file:', file)
      router.push('/details')
    } catch (error) {
      console.error('Document pick failed:', error)
    }
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

            <Pressable style={styles.primaryButton} onPress={handleUpload}>
              <Text style={styles.primaryButtonText}>Upload a materials list</Text>
            </Pressable>
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  scrollContent: {
    paddingBottom: 28,
  },
  container: {
    padding: 20,
    gap: 22,
  },
  hero: {
    gap: 10,
    paddingTop: 8,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '800',
    color: '#1F5F7C',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 23,
    color: '#3F4F5F',
  },
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
  optionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#69B8A7',
  },
  badge: {
    backgroundColor: '#F47A20',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  cardTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    color: '#1F5F7C',
  },
  imageWrap: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#EEF3F6',
  },
  preview: {
    width: '100%',
    height: 170,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#E8F0F2',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#446273',
  },
  cardBody: {
    fontSize: 16,
    lineHeight: 22,
    color: '#566575',
  },
  cardHint: {
    fontSize: 15,
    lineHeight: 20,
    color: '#7A8794',
  },
  manualMock: {
    backgroundColor: '#F7F9FA',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D7E0E5',
    padding: 12,
    gap: 10,
  },
  mockLineLong: {
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7E0E5',
  },
  mockRow: {
    flexDirection: 'row',
    gap: 10,
  },
  mockLineShort: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7E0E5',
  },
  primaryButton: {
    backgroundColor: '#F47A20',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: '#69B8A7',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#1F5F7C',
    fontSize: 16,
    fontWeight: '800',
  },
})
