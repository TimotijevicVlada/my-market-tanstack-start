import { useState } from 'react'
import { Camera, ShieldCheck } from 'lucide-react'
import { EditAvatar } from './EditAvatar'
import type { User } from '@/api/users/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getRole } from '@/routes/_private/admin/users/-data'
import { getImageUrl } from '@/utils/get-image-url'
import { useGetSessionUser } from '@/api/auth/queries'


export const AvatarSection = () => {
  const { data: sessionUser } = useGetSessionUser()

  const [open, setOpen] = useState(false)

  return (
    <>
      <EditAvatar user={sessionUser} open={open} onOpen={setOpen} />
      <Card className="overflow-hidden border-border/50">
        <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
        <CardContent className="relative pb-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6">
            <div className="relative -mt-12 sm:-mt-16">
              <Avatar className="size-24 border-4 border-background rounded-full shadow-xl sm:size-28">
                <AvatarImage
                  src={getImageUrl(sessionUser?.image)}
                  alt={sessionUser?.name}
                />
                <AvatarFallback className="bg-primary/10 text-3xl font-semibold text-primary">
                  {sessionUser?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <button
                className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
                onClick={() => setOpen(true)}
              >
                <Camera className="size-4" />
              </button>
            </div>
            <div className="flex-1 text-center sm:pb-1 sm:text-left">
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
                <h1 className="text-2xl font-bold tracking-tight">
                  {sessionUser?.name}
                </h1>
                <Badge variant="outline" className="gap-1 font-medium">
                  <ShieldCheck className="size-3" />
                  {sessionUser?.role ? getRole[sessionUser.role as User['role']].name : ''}
                </Badge>
              </div>
              <p className="mt-1 text-muted-foreground">{sessionUser?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
