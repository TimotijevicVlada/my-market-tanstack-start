import { useState } from 'react'
import { Globe, Mail, Phone } from 'lucide-react'
import { InfoRow } from '../../../../../../components/custom/InfoRow'
import { EditContactInfo } from './EditContactInfo'
import { SectionHead } from '@/components/custom/SectionHead'
import { Card, CardContent } from '@/components/ui/card'
import { useGetMySeller } from '@/api/sellers/queries'

export const ContactInfo = () => {
  const { data: seller } = useGetMySeller()
  const [isEditOpen, setIsEditOpen] = useState(false)

  return (
    <>
      <EditContactInfo
        seller={seller}
        open={isEditOpen}
        onOpen={setIsEditOpen}
      />
      <Card className="border-border/50">
        <CardContent>
          <SectionHead
            Icon={Phone}
            title="Kontakt informacije"
            description="Kako vas kupci mogu kontaktirati"
            onEdit={() => setIsEditOpen(true)}
            className="mb-6"
          />
          <div className="space-y-5">
            <InfoRow Icon={Mail} label="Email adresa" value={seller?.email} />
            <InfoRow Icon={Phone} label="Telefon" value={seller?.phone} />
            <InfoRow Icon={Globe} label="Website" value={seller?.website} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}
