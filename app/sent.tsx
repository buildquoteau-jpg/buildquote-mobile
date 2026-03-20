import { SafeAreaView, View, Text, Pressable, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import StepHeader from '../components/StepHeader'

export default function SentScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StepHeader step={4} />

      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>STEP 4</Text>
          <Text style={styles.title}>RFQ sent</Text>
          <Text style={styles.subtitle}>
            Your request for quote has been sent. You can start a new RFQ or go back and review the flow again.
          </Text>

          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>What happens next</Text>
            <Text style={styles.statusText}>• Supplier receives your RFQ</Text>
            <Text style={styles.statusText}>• You review responses</Text>
            <Text style={styles.statusText}>• BuildQuote will later track draft and sent RFQs here</Text>
          </View>

          <Pressable style={styles.primaryButton} onPress={() => router.replace('/')}>
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
  safe: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#D2DBE1',
    padding: 22,
    gap: 16,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#69B8A7',
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: '#1F5F7C',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 23,
    color: '#435260',
  },
  statusCard: {
    backgroundColor: '#F8FBFC',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DCE7EC',
    padding: 16,
    gap: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2A37',
  },
  statusText: {
    fontSize: 15,
    lineHeight: 21,
    color: '#435260',
  },
  primaryButton: {
    backgroundColor: '#F47A20',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: '#69B8A7',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F5F7C',
  },
})
