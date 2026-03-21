import { Stack } from 'expo-router'
import { RFQProvider } from '../lib/RFQContext'

export default function RootLayout() {
  return (
    <RFQProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </RFQProvider>
  )
}
