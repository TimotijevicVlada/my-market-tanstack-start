import { createFileRoute } from '@tanstack/react-router'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2 } from '@/server/r2'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_FOLDERS = [
  'sellers/avatars',
  'sellers/covers',
  'products',
  'test',
]

export const Route = createFileRoute('/api/uploads/presign')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const body = await request.json()
          const { fileName, fileType, folder } = body ?? {}

          if (!fileName || !fileType || !folder) {
            return Response.json(
              { error: 'fileName, fileType and folder are required' },
              { status: 400 },
            )
          }

          if (!ALLOWED_TYPES.includes(fileType)) {
            return Response.json(
              { error: 'Unsupported file type' },
              { status: 400 },
            )
          }

          if (!ALLOWED_FOLDERS.includes(folder)) {
            return Response.json(
              { error: 'Unsupported folder' },
              { status: 400 },
            )
          }

          const ext = fileName.split('.').pop() || 'jpg'
          const key = `${folder}/${crypto.randomUUID()}.${ext}`

          const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: key,
            ContentType: fileType,
          })

          const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 60 })
          const publicUrl = `${process.env.R2_PUBLIC_BASE_URL}/${key}`

          return Response.json({ uploadUrl, key, publicUrl })
        } catch (err) {
          console.error(err)
          return Response.json(
            { error: 'Failed to presign upload' },
            { status: 500 },
          )
        }
      },
    },
  },
})
