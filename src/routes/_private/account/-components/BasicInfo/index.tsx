import { MailIcon, ShieldCheck, UserIcon } from 'lucide-react'
import { useLoggedInUser } from '@/api/auth/queries'
import { InfoRow } from '@/components/custom/InfoRow'
import { SectionHead } from '@/components/custom/SectionHead'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { getRole } from '@/routes/_private/admin/users/-data'

export const BasicInfo = () => {
  const { data: user } = useLoggedInUser()

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <SectionHead
          Icon={UserIcon}
          title="Lični podaci"
          description="Vaše osnovne informacije"
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <InfoRow
            Icon={UserIcon}
            label="Korisničko ime"
            value={user?.username}
          />
        </div>
        <div className="space-y-2">
          <InfoRow Icon={MailIcon} label="Email adresa" value={user?.email} />
        </div>
        <div className="space-y-2">
          <InfoRow
            Icon={ShieldCheck}
            label="Uloga"
            value={user?.role ? getRole[user.role].name : ''}
          />
        </div>
      </CardContent>
    </Card>
  )
}
