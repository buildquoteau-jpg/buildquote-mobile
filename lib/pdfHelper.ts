import { Platform } from 'react-native'
import { File, Paths } from 'expo-file-system/next'
import * as Sharing from 'expo-sharing'
import * as IntentLauncher from 'expo-intent-launcher'
import * as FileSystem from 'expo-file-system'

const API_BASE = 'https://buildquote.com.au'

export async function previewPDF(payload: any): Promise<void> {
  const filename = payload.rfqId || 'RFQ-Preview'

  const response = await fetch(`${API_BASE}/api/pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`PDF generation failed: ${err}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer)

  const file = new File(Paths.cache, `${filename}.pdf`)
  file.write(bytes)

  // #9 — Try to open full-screen PDF viewer instead of share sheet
  if (Platform.OS === 'android') {
    try {
      // On Android, get a content:// URI and launch with PDF viewer intent
      const contentUri = await FileSystem.getContentUriAsync(file.uri)
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: contentUri,
        flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
        type: 'application/pdf',
      })
      return
    } catch {
      // Fall through to share sheet
    }
  }

  // iOS: QuickLook via share sheet is the best native option from Expo
  // (expo-sharing on iOS presents a full-screen preview before the share actions)
  await Sharing.shareAsync(file.uri, {
    mimeType: 'application/pdf',
    dialogTitle: `${filename}.pdf`,
    UTI: 'com.adobe.pdf',
  })
}
