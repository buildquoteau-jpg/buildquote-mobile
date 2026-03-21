import { SafeAreaView, View, Text, Pressable, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import StepHeader from '../components/StepHeader'

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StepHeader step={1} />

      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.title}>Your handwritten materials list.</Text>
          <Text style={styles.title}>Turned into a professional RFQ.</Text>
          <Text style={styles.instantly}>Instantly.</Text>

          <Text style={styles.subtitle}>
            Snap a photo <Text style={styles.arrow}>→</Text> We read it <Text style={styles.arrow}>→</Text> You review it
          </Text>
          <Text style={styles.subtitle}>
            <Text style={styles.arrow}>→</Text> Hit send
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardText}>
            Send clear building materials quote requests to your trusted suppliers.
          </Text>

          <Pressable style={styles.primaryButton} onPress={() => router.push('/capture')}>
            <Text style={styles.primaryButtonText}>Send a Quote Request</Text>
          </Pressable>

          <Text style={styles.helper}>Takes about 60 seconds</Text>
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
    justifyContent: 'flex-start',
    gap: 14,
  },
  hero: {
    gap: 6,
    paddingTop: 4,
    marginTop: -6,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: '#1F2A37',
    textAlign: 'center',
  },
  instantly: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: '#f97316',
    textAlign: 'center',
    marginTop: -2,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: '#185D7A',
    textAlign: 'center',
    marginTop: 6,
  },
  arrow: {
    color: '#f97316',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  cardText: {
    fontSize: 17,
    lineHeight: 25,
    color: '#1F2A37',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#f97316',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  helper: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
  },
})
