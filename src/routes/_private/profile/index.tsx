import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { useUploadToR2 } from '@/api/uploads/queries'

export const Route = createFileRoute('/_private/profile/')({
  component: ProfileComponent,
})

function ProfileComponent() {
  const [url, setUrl] = useState<string | null>(null)
  const { mutate: uploadImage } = useUploadToR2()

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    uploadImage(
      { file, folder: 'test' },
      {
        onSuccess: (data) => {
          setUrl(data)
        },
      },
    )
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
