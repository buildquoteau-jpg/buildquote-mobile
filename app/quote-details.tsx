import { SafeAreaView, View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native'
import { router } from 'expo-router'
import StepHeader from '../components/StepHeader'

export default function QuoteDetailsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StepHeader step={3} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>

          <Text style={styles.sectionTitle}>Your Details</Text>

          <TextInput placeholder="Builder Name" style={styles.input} />
          <TextInput placeholder="Company Name" style={styles.input} />
          <TextInput placeholder="Phone" style={styles.input} />
          <TextInput placeholder="Email" style={styles.input} />

          <Text style={styles.sectionTitle}>Supplier</Text>

          <TextInput placeholder="Supplier Name" style={styles.input} />
          <TextInput placeholder="Supplier Email" style={styles.input} />

          <Text style={styles.sectionTitle}>Project</Text>

          <TextInput placeholder="Project Reference" style={styles.input} />

          <Text style={styles.sectionTitle}>Message</Text>

          <TextInput
            placeholder="Any notes for supplier..."
            style={[styles.input, styles.textArea]}
            multiline
          />

          <Pressable style={styles.primaryButton} onPress={() => router.push('/sent')}>
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

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 10,
    color: '#1F2A37',
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#D2DBE1',
  },

  textArea: {
    height: 100,
  },

  primaryButton: {
    backgroundColor: '#F47A20',
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 20,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },

  back: {
    marginTop: 12,
    textAlign: 'center',
    color: '#445C70',
  },
})
