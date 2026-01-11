import { useMemo } from 'react'
import { createFileRoute, useSearch } from '@tanstack/react-router'
import z from 'zod'
import { Ban, Building2 } from 'lucide-react'
import { tabs } from './-data'
import { ProfileSection } from './-components/ProfileSection'
import { SellerStepperForm } from './-components/CreateSellerSection'
import { useLoggedInUser } from '@/api/auth/queries'
import { useGetSellerByUserId } from '@/api/sellers/queries'
import { Tabs } from '@/components/custom/Tabs'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@/components/ui/alert'

export const Route = createFileRoute('/_private/profile/')({
  component: ProfileComponent,
  validateSearch: z.object({
    tab: z.enum(['profile', 'create-seller']),
  }),
})

function ProfileComponent() {
  const navigate = Route.useNavigate()

  const { data: user } = useLoggedInUser()
  const { data: seller } = useGetSellerByUserId(user?.id)

  const { role } = user ?? {}

  const { tab = 'profile' } = useSearch({ from: '/_private/profile/' })

  const finalTabs = useMemo(() => {
    if (role === 'buyer') {
      return tabs
    }
    return tabs.filter((item) => item.value !== 'create-seller')
  }, [user])

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Tabs
        defaultValue={tab}
        value={tab}
        tabs={finalTabs}
        variant="line"
        className="mb-5"
        size="lg"
        onTabChange={(newTab) =>
          navigate({ to: '/profile', search: { tab: newTab.value } })
        }
      />
      {seller?.status === 'pending' && (
        <Alert variant="warning" appearance="light">
          <AlertIcon>
            <Building2 className="size-4 text-yellow-500" />
          </AlertIcon>
          <div>
            <AlertTitle>Vaša prodavnica je u procesu verifikacije.</AlertTitle>
            <AlertDescription>
              Molimo Vas da sačekate, obično je potrebno do 24 sata.
            </AlertDescription>
          </div>
        </Alert>
      )}
      {seller?.status === 'rejected' && (
        <Alert variant="destructive" appearance="light">
          <AlertIcon>
            <Ban />
          </AlertIcon>
          <div>
            <AlertTitle>Vaša prodavnica je odbijena.</AlertTitle>
            {seller.verificationNote && (
              <AlertDescription>
                Razlog odbijanja: {seller.verificationNote}
              </AlertDescription>
            )}
          </div>
        </Alert>
      )}
      {tab === 'profile' && <ProfileSection />}
      {tab === 'create-seller' && <SellerStepperForm userId={user?.id} />}
    </div>
  )
}
