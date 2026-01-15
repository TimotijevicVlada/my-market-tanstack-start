import { useState } from 'react'
import { Building2, FileText, Globe, MapPin } from 'lucide-react'
import { InfoRow } from '../InfoRow'
import { EditLocationInfo } from './EditLocationInfo'
import { SectionHead } from '@/components/custom/SectionHead'
import { Card, CardContent } from '@/components/ui/card'
import { useGetMySeller } from '@/api/sellers/queries'

export const LocationInfo = () => {
  const { data: seller } = useGetMySeller()

  const [isEditOpen, setIsEditOpen] = useState(false)

  return (
    <>
      <EditLocationInfo
        seller={seller}
        open={isEditOpen}
        onOpen={setIsEditOpen}
      />
      <Card className="border-border/50">
        <CardContent>
          <SectionHead
            Icon={MapPin}
            title="Lokacija"
            description="Adresa vaše prodavnice"
            onEdit={() => setIsEditOpen(true)}
            className="mb-6"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <InfoRow
              icon={<Globe className="h-4 w-4" />}
              label="Država"
              value={seller?.country}
            />
            <InfoRow
              icon={<Building2 className="h-4 w-4" />}
              label="Grad"
              value={seller?.city}
            />
            <InfoRow
              icon={<MapPin className="h-4 w-4" />}
              label="Adresa"
              value={seller?.address}
            />
            <InfoRow
              icon={<FileText className="h-4 w-4" />}
              label="Poštanski broj"
              value={seller?.postalCode}
            />
          </div>
        </CardContent>
      </Card>
    </>
  )
}
