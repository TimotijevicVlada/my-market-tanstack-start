import { Link2Icon, ShieldCheck } from 'lucide-react'
import { GoogleAccount } from './GoogleAccount'
import { FacebookAccount } from './FacebookAccount'
import { Credentials } from './Credentials'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { SectionHead } from '@/components/custom/SectionHead'

export type Provider = 'google' | 'facebook' | 'credential'

export const AccountsSection = () => {

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <SectionHead
          Icon={Link2Icon}
          title="Povezani nalozi"
          description="Upravljajte načinima prijave na vaš nalog"
          className="pb-2"
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <GoogleAccount />
          <FacebookAccount />
          <Credentials />
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <ShieldCheck className="mt-0.5 size-5 flex-shrink-0 text-primary" />
          <div className="text-sm">
            <p className="font-medium text-foreground">
              Preporuka za sigurnost
            </p>
            <p className="mt-1 text-muted-foreground">
              Povežite više načina prijave kako biste osigurali pristup vašem
              nalogu čak i ako izgubite pristup jednom od njih.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
