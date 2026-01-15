import { useState } from 'react'
import { Calendar, Camera, Star } from 'lucide-react'
import { statusConfig } from '../../data'
import { EditImages } from './EditImages'
import { Button } from '@/components/custom/Button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useGetMySeller } from '@/api/sellers/queries'
import { getImageUrl } from '@/utils/get-image-url'

export const ImagesSection = () => {
  const { data: seller } = useGetMySeller()

  const status = statusConfig[seller?.status ?? 'pending']

  const [isEditOpen, setIsEditOpen] = useState(false)

  return (
    <>
      <EditImages seller={seller} open={isEditOpen} onOpen={setIsEditOpen} />
      <Card className="overflow-hidden border-border/50 pt-0">
        <div className="relative h-40 md:h-48 bg-gradient-to-br from-primary/30 via-primary/20 to-background">
          {seller?.coverImageUrl && (
            <img
              src={getImageUrl(seller.coverImageUrl)}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/30 to-transparent" />
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-3 right-3 bg-background/50 backdrop-blur-sm hover:bg-background/80"
            onClick={() => setIsEditOpen(true)}
          >
            <Camera className="mr-2" />
            Izmeni slike
          </Button>
        </div>

        <CardContent className="relative pt-0 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12 md:-mt-16">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-card rounded-full shadow-xl">
                <AvatarImage
                  src={getImageUrl(seller?.avatarUrl)}
                  alt={seller?.displayName}
                />
                <AvatarFallback className="bg-primary/20 text-primary text-2xl md:text-3xl font-bold">
                  {seller?.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-xl md:text-2xl font-bold text-foreground">
                  {seller?.displayName}
                </h1>
                <Badge variant="outline" className={status.className}>
                  {status.icon}
                  <span className="ml-1.5">{status.label}</span>
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-medium text-foreground">
                    {seller?.ratingAvg}
                  </span>
                  <span>({seller?.ratingCount} ocena)</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Član od{' '}
                    {seller?.createdAt?.toLocaleDateString('sr-Latn-RS', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
