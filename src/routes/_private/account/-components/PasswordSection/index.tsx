import { LockIcon, ShieldCheck, ShieldEllipsis } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/custom/Button'
import { SectionHead } from '@/components/custom/SectionHead'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { FormFieldPassword } from '@/components/custom/FormFieldPassword'
import { useChangeSessionUserPassword } from '@/api/auth/queries'

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Trenutna lozinka je obavezna'),
    newPassword: z
      .string()
      .min(1, 'Nova lozinka je obavezna')
      .min(4, 'Nova lozinka mora imati najmanje 4 karaktera'),
    confirmPassword: z.string().min(1, 'Potvrda lozinke je obavezna'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Lozinke se ne podudaraju',
    path: ['confirmPassword'],
  })

type PasswordFormData = z.infer<typeof passwordSchema>

export const PasswordSection = () => {

  const { mutate: changeSessionUserPassword, isPending } = useChangeSessionUserPassword()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (data: PasswordFormData) => {
    changeSessionUserPassword({
      currentPassword: data.oldPassword,
      newPassword: data.newPassword
    }, {
      onSuccess: () => {
        reset()
      },
    })
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <SectionHead
          Icon={LockIcon}
          title="Promena lozinke"
          description="Zaštitite vaš nalog sa novom lozinkom"
          className="pb-2"
        />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <FormFieldPassword
                label="Trenutna lozinka"
                placeholder="Unesite trenutnu lozinku"
                startIcon={<ShieldEllipsis className="size-4" />}
                error={errors.oldPassword?.message}
                {...register('oldPassword')}
              />
            </div>
            <div className="space-y-2">
              <FormFieldPassword
                label="Nova lozinka"
                placeholder="Unesite novu lozinku"
                startIcon={<ShieldCheck className="size-4" />}
                error={errors.newPassword?.message}
                {...register('newPassword')}
              />
            </div>
            <div className="space-y-2">
              <FormFieldPassword
                label="Potvrdi lozinku"
                placeholder="Potvrdite novu lozinku"
                startIcon={<ShieldCheck className="size-4" />}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            {isDirty && (
              <Button variant="outline" type="button" onClick={() => reset()}>
                Poništi
              </Button>
            )}
            <Button
              loading={{
                state: isPending,
                text: 'Promena lozinke...',
              }}
              type="submit"
            >
              Promeni lozinku
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
