import { File, Paths } from 'expo-file-system/next'
import * as Sharing from 'expo-sharing'

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

  await Sharing.shareAsync(file.uri, {
    mimeType: 'application/pdf',
    dialogTitle: `${filename}.pdf`,
    UTI: 'com.adobe.pdf',
  })
}
