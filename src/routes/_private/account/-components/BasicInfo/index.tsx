import { MailIcon, ShieldCheck, UserIcon } from 'lucide-react'
import type { User } from '@/api/users/types'
import { InfoRow } from '@/components/custom/InfoRow'
import { SectionHead } from '@/components/custom/SectionHead'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { getRole } from '@/routes/_private/admin/users/-data'
import { useGetSessionUser } from '@/api/auth/queries'

export const BasicInfo = () => {
  const { data: sessionUser } = useGetSessionUser()

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
            value={sessionUser?.name}
          />
        </div>
        <div className="space-y-2">
          <InfoRow Icon={MailIcon} label="Email adresa" value={sessionUser?.email} />
        </div>
        <div className="space-y-2">
          <InfoRow
            Icon={ShieldCheck}
            label="Uloga"
            value={sessionUser?.role ? getRole[sessionUser.role as User['role']].name : ''}
          />
        </div>
      </CardContent>
    </Card>
  )
}
