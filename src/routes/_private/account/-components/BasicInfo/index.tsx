import { z } from 'zod'
import { useState } from 'react'
import { MailIcon, ShieldCheck, UserIcon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { User } from '@/api/users/types'
import { InfoRow } from '@/components/custom/InfoRow'
import { SectionHead } from '@/components/custom/SectionHead'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { getRole } from '@/routes/_private/admin/users/-data'
import { useGetSessionUser, useUpdateSessionUserBasicInfo } from '@/api/auth/queries'
import { FormField } from '@/components/custom/FormField'
import { Button } from '@/components/custom/Button'

const basicInfoSchema = z.object({
  name: z.string().trim().min(1, 'Korisničko ime je obavezno'),
  email: z.email('Neispravna email adresa'),
})

type BasicInfoSchema = z.infer<typeof basicInfoSchema>

const basicInfoDefaultValues = {
  name: '',
  email: '',
}

export const BasicInfo = () => {
  const { data: sessionUser } = useGetSessionUser()
  const [isEditMode, setIsEditMode] = useState(false)

  const { mutate: updateSessionUserBasicInfo, isPending } = useUpdateSessionUserBasicInfo()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BasicInfoSchema>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: basicInfoDefaultValues,
  })

  const onSubmit = (data: BasicInfoSchema) => {
    updateSessionUserBasicInfo(data, {
      onSuccess: () => {
        setIsEditMode(false)
        reset()
      },
    })
  }

  const handleSetEditMode = () => {
    setIsEditMode(prev => !prev)
    reset({
      name: sessionUser?.name,
      email: sessionUser?.email,
    })
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <SectionHead
          Icon={UserIcon}
          title="Lični podaci"
          description="Vaše osnovne informacije"
          onEdit={handleSetEditMode}
        />
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {
              isEditMode ?
                <FormField
                  required
                  label="Korisničko ime"
                  placeholder="Unesite korisničko ime"
                  {...register('name')}
                  error={errors.name?.message}
                  startIcon={<UserIcon className="size-4" />}
                />
                :
                <InfoRow
                  Icon={UserIcon}
                  label="Korisničko ime"
                  value={sessionUser?.name}
                />
            }
          </div>
          <div className="space-y-2">
            {
              isEditMode ?
                <FormField
                  required
                  label="Email adresa"
                  placeholder="Unesite email adresu"
                  {...register('email')}
                  error={errors.email?.message}
                  startIcon={<MailIcon className="size-4" />}
                />
                :
                <InfoRow Icon={MailIcon} label="Email adresa" value={sessionUser?.email} />
            }
          </div>
          <div className="space-y-2">
            {isEditMode ?
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setIsEditMode(false)}>
                  Odustani
                </Button>
                <Button
                  type="submit"
                  loading={{
                    state: isPending,
                    text: 'Čuvanje...',
                  }}
                >
                  Sačuvaj
                </Button>
              </div>
              :
              <InfoRow
                Icon={ShieldCheck}
                label="Uloga"
                value={sessionUser?.role ? getRole[sessionUser.role as User['role']].name : ''}
              />
            }
          </div>
        </CardContent>
      </form>
    </Card>
  )
}
