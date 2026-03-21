import AsyncStorage from '@react-native-async-storage/async-storage'
import { BuilderDetails } from './types'

const STORAGE_KEY = 'buildquote_builder_details'

export async function loadSavedBuilder(): Promise<BuilderDetails | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // Validate shape
    if (parsed && typeof parsed.builderName === 'string' && typeof parsed.email === 'string') {
      return parsed as BuilderDetails
    }
    return null
  } catch {
    return null
  }
}

export async function saveBuilder(builder: BuilderDetails): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(builder))
  } catch {
    // Silently fail — not critical
  }
}

export async function clearSavedBuilder(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY)
  } catch {
    // Silently fail
  }
}
