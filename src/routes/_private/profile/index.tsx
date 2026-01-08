import { createFileRoute, useSearch } from '@tanstack/react-router'
import z from 'zod'
import { HourglassIcon } from 'lucide-react'
import { tabs } from './-data'
import { ProfileSection } from './-components/ProfileSection'
import { CreateSellerSection } from './-components/CreateSellerSection'
import { useLoggedInUser } from '@/api/auth/queries'
import { useGetSellerByUserId } from '@/api/sellers/queries'
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@/components/ui/alert'
import { Tabs } from '@/components/custom/Tabs'

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

  const { tab = 'profile' } = useSearch({ from: '/_private/profile/' })

  return (
    <div className="pl-10">
      <Tabs
        defaultValue={tab}
        value={tab}
        tabs={tabs}
        variant="line"
        className="mb-5"
        onTabChange={(newTab) =>
          navigate({ to: '/profile', search: { tab: newTab.value } })
        }
      />
      {seller?.status === 'pending' && (
        <Alert variant="warning" appearance="light" className="max-w-120">
          <AlertIcon>
            <HourglassIcon className="size-4" />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>Vaša prodavnica je u procesu verifikacije.</AlertTitle>
            <AlertDescription>
              Molimo Vas da sačekate obicno je potrebno do 24 sata.
            </AlertDescription>
          </AlertContent>
        </Alert>
      )}
      {tab === 'profile' && <ProfileSection />}
      {tab === 'create-seller' && <CreateSellerSection />}
    </div>
  )
}
