import { MailIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/custom/Button'
import { SectionHead } from '@/components/custom/SectionHead'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { FormField } from '@/components/custom/FormField'
import { useUpdateSessionUserEmail } from '@/api/auth/queries'

const emailSchema = z.object({
  email: z.email('Neispravna email adresa'),
})

export const EmailSection = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  })

  const { mutate: updateMyUserEmail, isPending } = useUpdateSessionUserEmail()

  const onSubmit = (data: { email: string }) => {
    updateMyUserEmail(data, {
      onSuccess: () => {
        reset()
      },
    })
  }
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <SectionHead
          Icon={MailIcon}
          title="Promena email adrese"
          description="Ažurirajte vašu email adresu"
          className="pb-2"
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            required
            label="Nova email adresa"
            startIcon={<MailIcon className="size-4" />}
            placeholder="Unesite novu email adresu"
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="flex justify-end gap-2">
            {isDirty && (
              <Button variant="outline" type="button" onClick={() => reset()}>
                Poništi
              </Button>
            )}
            <Button
              loading={{
                state: isPending,
                text: 'Promena email adrese...',
              }}
            >
              Promeni email
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
