import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { presignUpload } from './server'

interface UploadToR2Input {
  file: File
  folder: string
}

export function useUploadToR2() {
  return useMutation({
    mutationFn: async (data: UploadToR2Input) => {
      const { file, folder } = data
      const { uploadUrl, publicUrl } = await presignUpload({
        data: {
          fileName: file.name,
          fileType: file.type,
          folder,
        },
      })

      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      if (!uploadRes.ok) {
        throw new Error('Upload failed')
      }

      return publicUrl
    },
    onSuccess: () => {
      toast.success('Fajl je uspešno učitavan')
    },
    onError: (error) => {
      toast.error(error.message || 'Greška pri učitavanju fajla')
    },
  })
}
