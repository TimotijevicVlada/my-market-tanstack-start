export async function uploadToR2(file: File, folder: string) {
  const presignRes = await fetch('/api/uploads/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      folder,
    }),
  })

  if (!presignRes.ok) {
    const err = await presignRes.json().catch(() => ({}))
    throw new Error(err?.error ?? 'Failed to get presigned URL')
  }

  const { uploadUrl, publicUrl } = await presignRes.json()

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })

  if (!uploadRes.ok) {
    throw new Error('Upload failed')
  }

  return publicUrl
}
