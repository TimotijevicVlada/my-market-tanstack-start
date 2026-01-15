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
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Opis
              </span>
              <p className="text-sm text-foreground leading-relaxed">
                {seller?.description || (
                  <span className="text-muted-foreground italic">
                    Nije uneto
                  </span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
