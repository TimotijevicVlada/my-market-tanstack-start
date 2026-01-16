import { useState } from 'react'
import { Store } from 'lucide-react'
import { InfoRow } from '../InfoRow'
import { EditBasicInfo } from './EditBasicInfo'
import { SectionHead } from '@/components/custom/SectionHead'
import { Card, CardContent } from '@/components/ui/card'
import { useGetMySeller } from '@/api/sellers/queries'

export const BasicInfo = () => {
  const { data: seller } = useGetMySeller()
  const [isEditOpen, setIsEditOpen] = useState(false)

  return (
    <>
      <EditBasicInfo seller={seller} open={isEditOpen} onOpen={setIsEditOpen} />
      <Card className="border-border/50">
        <CardContent>
          <SectionHead
            Icon={Store}
            title="Osnovne informacije"
            description="Podaci o vašoj prodavnici"
            onEdit={() => setIsEditOpen(true)}
            className="mb-6"
          />
          <div className="space-y-5">
            <InfoRow
              icon={<Store className="h-4 w-4" />}
              label="Naziv prodavnice"
              value={seller?.displayName}
            />
            <InfoRow label="Opis" value={seller?.description} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}
