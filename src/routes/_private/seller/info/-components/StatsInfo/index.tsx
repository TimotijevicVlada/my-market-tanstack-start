import { Star } from 'lucide-react'
import { SectionHead } from '@/components/custom/SectionHead'
import { Card, CardContent } from '@/components/ui/card'
import { useGetMySeller } from '@/api/sellers/queries'

export const StatsInfo = () => {
  const { data: seller } = useGetMySeller()

  return (
    <Card className="border-border/50">
      <CardContent>
        <SectionHead
          Icon={Star}
          title="Performanse"
          description="Statistika vaše prodavnice"
          className="mb-6"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-accent dark:bg-accent/50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Star className="h-5 w-5 fill-primary text-primary" />
              <span className="text-2xl font-bold text-foreground">
                {seller?.ratingAvg}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Prosečna ocena
            </span>
          </div>
          <div className="bg-accent dark:bg-accent/50 rounded-xl p-4 text-center">
            <span className="text-2xl font-bold text-foreground">
              {seller?.ratingCount}
            </span>
            <p className="text-xs text-muted-foreground">Broj ocena</p>
          </div>
          <div className="bg-accent dark:bg-accent/50 rounded-xl p-4 text-center">
            <span className="text-2xl font-bold text-foreground">
              {seller?.commissionRate}%
            </span>
            <p className="text-xs text-muted-foreground">Provizija</p>
          </div>
          <div className="bg-accent dark:bg-accent/50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <div
                className={`h-2.5 w-2.5 rounded-full ${seller?.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}
              />
              <span className="text-lg font-semibold text-foreground">
                {seller?.isActive ? 'Aktivan' : 'Neaktivan'}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">Status</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
