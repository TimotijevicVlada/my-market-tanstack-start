import { createFileRoute } from '@tanstack/react-router'
import { Ban, Building2 } from 'lucide-react'
import { AvatarSection } from './-components/AvatarSection'
import { EmailSection } from './-components/EmailSection'
import { BasicInfo } from './-components/BasicInfo'
import { PasswordSection } from './-components/PasswordSection'
import { useGetMySeller } from '@/api/sellers/queries'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@/components/ui/alert'

export const Route = createFileRoute('/_private/account/')({
  component: AccountPage,
})

function AccountPage() {
  const { data: seller } = useGetMySeller()

  return (
    <div className="mx-auto max-w-4xl w-full space-y-6">
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
      <div className="space-y-6">
        <AvatarSection />
        <div className="grid gap-6 md:grid-cols-2">
          <BasicInfo />
          <EmailSection />
        </div>
        <PasswordSection />
      </div>
    </div>
  )
}
