import { useMemo } from 'react'
import { createFileRoute, useSearch } from '@tanstack/react-router'
import z from 'zod'
import { Building2 } from 'lucide-react'
import { tabs } from './-data'
import { ProfileSection } from './-components/ProfileSection'
import { SellerStepperForm } from './-components/CreateSellerSection'
import { useLoggedInUser } from '@/api/auth/queries'
import { useGetSellerByUserId } from '@/api/sellers/queries'
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
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20">
            <Building2 className="size-4 text-amber-500" />
          </div>
          <div>
            <p className="font-medium text-amber-500">
              Vaša prodavnica je u procesu verifikacije.
            </p>
            <p className="text-sm text-amber-500/70">
              Molimo Vas da sačekate, obično je potrebno do 24 sata.
            </p>
          </div>
        </div>
      )}
      {tab === 'profile' && <ProfileSection />}
      {tab === 'create-seller' && <SellerStepperForm />}
    </div>
  )
}
