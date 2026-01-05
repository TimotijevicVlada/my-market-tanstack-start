import { createServerFn } from '@tanstack/react-start'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2 } from '@/server/r2'

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'image/jfif',
  'image/avif',
]
const ALLOWED_FOLDERS = [
  'sellers/avatars',
  'sellers/covers',
  'products',
  'test',
]

export interface PresignUploadInput {
  fileName: string
  fileType: string
  folder: string
}

export const presignUpload = createServerFn({
  method: 'POST',
})
  .inputValidator((data: PresignUploadInput) => data)
  .handler(async ({ data }) => {
    const { fileName, fileType, folder } = data

    if (!ALLOWED_TYPES.includes(fileType)) {
      throw new Error('Unsupported file type')
    }

    if (!ALLOWED_FOLDERS.includes(folder)) {
      throw new Error('Unsupported folder')
    }

    const ext = fileName.split('.').pop() || 'jpg'
    const key = `test/${crypto.randomUUID()}.${ext}`

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
    })

    const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 60 })
    const publicUrl = `${process.env.R2_PUBLIC_BASE_URL}/${key}`

    return { uploadUrl, key, publicUrl }
  })
