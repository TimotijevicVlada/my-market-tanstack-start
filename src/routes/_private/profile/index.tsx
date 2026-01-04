import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { uploadToR2 } from '@/lib/uploadToR2'

export const Route = createFileRoute('/_private/profile/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [url, setUrl] = useState<string | null>(null)

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const uploadedUrl = await uploadToR2(file, 'test')
    setUrl(uploadedUrl)
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={onChange} />
      {url && (
        <div style={{ marginTop: 16 }}>
          <a href={url} target="_blank" rel="noreferrer">
            Open uploaded image
          </a>
          <img
            src={url}
            alt="uploaded"
            style={{ maxWidth: 300, display: 'block', marginTop: 8 }}
          />
        </div>
      )}
    </div>
  )
}
