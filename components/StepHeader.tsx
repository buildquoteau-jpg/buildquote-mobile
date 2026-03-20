import { View, Text, StyleSheet, Pressable } from 'react-native'
import { router } from 'expo-router'

const steps = ['Capture', 'Items', 'Details', 'Sent']

export default function StepHeader({ step }: { step: number }) {
  return (
    <View style={styles.wrapper}>
      <Pressable onPress={() => router.replace('/')} style={styles.brandTap}>
        <Text style={styles.logo}>
          <Text style={styles.build}>Build</Text>
          <Text style={styles.quote}>Quote</Text>
        </Text>
        <Text style={styles.tagline}>Request for Quotation, Made Simple</Text>
      </Pressable>

      <View style={styles.stepRow}>
        {steps.map((item, i) => {
          const index = i + 1
          const active = step === index
          const done = step > index

          return (
            <View key={item} style={styles.stepItem}>
              <View
                style={[
                  styles.dot,
                  active && styles.dotActive,
                  done && styles.dotDone,
                ]}
              />
              <Text
                style={[
                  styles.stepText,
                  active && styles.stepTextActive,
                ]}
              >
                {item}
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    paddingTop: 8,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E3E8EC',
  },
  brandTap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 6,
  },
  logo: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  build: {
    color: '#2F3E4F',
  },
  quote: {
    color: '#F47A20',
  },
  tagline: {
    marginTop: 2,
    fontSize: 12,
    color: '#445C70',
    fontWeight: '600',
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#D2DBE1',
  },
  dotActive: {
    backgroundColor: '#F47A20',
  },
  dotDone: {
    backgroundColor: '#3E7C59',
  },
  stepText: {
    fontSize: 11,
    color: '#7B8794',
    fontWeight: '600',
  },
  stepTextActive: {
    color: '#2F3E4F',
    fontWeight: '800',
  },
})
