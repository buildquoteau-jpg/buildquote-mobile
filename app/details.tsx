import { SafeAreaView, View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native'
import { router } from 'expo-router'
import StepHeader from '../components/StepHeader'

export default function DetailsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StepHeader step={2} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.hero}>
            <Text style={styles.title}>Review and edit your items</Text>
            <Text style={styles.subtitle}>
              We’ve extracted your materials. Check anything marked for review before sending.
            </Text>
            <Text style={styles.meta}>2 items in this draft</Text>
          </View>

          <View style={[styles.noticeCard, styles.noticeWarning]}>
            <Text style={styles.noticeTitle}>Check low-confidence fields</Text>
            <Text style={styles.noticeText}>
              Some values may need a quick edit. You can also add more items manually or upload another list.
            </Text>
          </View>

          <View style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemLabel}>ITEM 1</Text>
              <View style={[styles.badge, styles.badgeHigh]}>
                <Text style={[styles.badgeText, styles.badgeHighText]}>High confidence</Text>
              </View>
            </View>

            <TextInput defaultValue="H2 treated pine post" placeholder="Product name" placeholderTextColor="#97A3AF" style={styles.input} />
            <TextInput defaultValue="2400 x 90 x 90" placeholder="Specs / description" placeholderTextColor="#97A3AF" style={styles.input} />

            <View style={styles.row}>
              <TextInput defaultValue="POST-H2-90" placeholder="SKU" placeholderTextColor="#97A3AF" style={[styles.input, styles.third]} />
              <TextInput defaultValue="ea" placeholder="UOM" placeholderTextColor="#97A3AF" style={[styles.input, styles.third]} />
              <TextInput defaultValue="12" placeholder="Qty" placeholderTextColor="#97A3AF" style={[styles.input, styles.third]} />
            </View>
          </View>

          <View style={[styles.itemCard, styles.itemCardReview]}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemLabel}>ITEM 2</Text>
              <View style={[styles.badge, styles.badgeReview]}>
                <Text style={[styles.badgeText, styles.badgeReviewText]}>Needs review</Text>
              </View>
            </View>

            <TextInput defaultValue="FC cladding sheet" placeholder="Product name" placeholderTextColor="#97A3AF" style={[styles.input, styles.inputReview]} />
            <TextInput defaultValue="?" placeholder="Specs / description" placeholderTextColor="#97A3AF" style={[styles.input, styles.inputReview]} />

            <View style={styles.row}>
              <TextInput defaultValue="" placeholder="SKU" placeholderTextColor="#97A3AF" style={[styles.input, styles.third, styles.inputReview]} />
              <TextInput defaultValue="sheet" placeholder="UOM" placeholderTextColor="#97A3AF" style={[styles.input, styles.third, styles.inputReview]} />
              <TextInput defaultValue="24" placeholder="Qty" placeholderTextColor="#97A3AF" style={[styles.input, styles.third, styles.inputReview]} />
            </View>

            <Text style={styles.reviewHint}>
              Parser was unsure about product details. Please check this item.
            </Text>
          </View>

          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonLabel}>OPTION 3</Text>
            <Text style={styles.secondaryButtonText}>Add another manual item</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={() => router.push('/capture')}>
            <Text style={styles.secondaryButtonLabel}>OPTION 1</Text>
            <Text style={styles.secondaryButtonText}>Upload another list</Text>
          </Pressable>

          <Pressable style={styles.primaryButton} onPress={() => router.push('/quote-details')}>
            <Text style={styles.primaryButtonText}>Continue — add quote details →</Text>
          </Pressable>
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
    gap: 18,
  },
  hero: {
    gap: 8,
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
    lineHeight: 22,
    color: '#435260',
  },
  meta: {
    fontSize: 15,
    color: '#7B8794',
  },
  noticeCard: {
    borderRadius: 18,
    padding: 16,
    gap: 8,
  },
  noticeWarning: {
    backgroundColor: '#FFF4E8',
    borderWidth: 1,
    borderColor: '#F3C08A',
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#8A4B08',
  },
  noticeText: {
    fontSize: 15,
    lineHeight: 21,
    color: '#7A4B1E',
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#D2DBE1',
    padding: 16,
    gap: 12,
  },
  itemCardReview: {
    borderColor: '#F0B56A',
    backgroundColor: '#FFFDFC',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLabel: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#1F5F7C',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeHigh: {
    backgroundColor: '#E7F7F1',
  },
  badgeHighText: {
    color: '#157A5A',
  },
  badgeReview: {
    backgroundColor: '#FFF1DE',
  },
  badgeReviewText: {
    color: '#A85B00',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D2DBE1',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: '#243444',
  },
  inputReview: {
    borderColor: '#F0B56A',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  third: {
    flex: 1,
  },
  reviewHint: {
    fontSize: 14,
    lineHeight: 20,
    color: '#8A5A20',
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: '#69B8A7',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#69B8A7',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F5F7C',
  },
  primaryButton: {
    backgroundColor: '#F47A20',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
})
