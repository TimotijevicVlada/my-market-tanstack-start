import { useNavigate } from '@tanstack/react-router'
import type { CreateSellerPayload } from '@/api/sellers/types'
import { useLoggedInUser } from '@/api/auth/queries'
import { useCreateSeller } from '@/api/sellers/queries'
import { SellerForm } from '@/components/shared/SellerForm'

export const CreateSellerSection = () => {
  const navigate = useNavigate()

  const { data: user } = useLoggedInUser()

  // TODO: We need other create seller server function without admin permissions
  const { mutate: createSeller, isPending } = useCreateSeller({
    page: 1,
    limit: 10,
    sort: { key: 'createdAt', order: 'desc' },
  })

  const onFormSubmit = (data: CreateSellerPayload) => {
    createSeller(data, {
      onSuccess: () => {
        navigate({ to: '/profile', search: { tab: 'profile' } })
      },
    })
  }

  return (
    <div className="mt-4 max-w-120">
      <h2 className="text-xl font-bold mb-4">Kreiranje prodavnice</h2>
      <SellerForm
        onFormSubmit={onFormSubmit}
        isSubmitting={isPending}
        type="create"
        userId={user?.id}
      />
    </div>
  )
}
