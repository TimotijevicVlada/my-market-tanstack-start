import { MailIcon } from 'lucide-react'
import { Link, createFileRoute, } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/custom/Button'
import { FormField } from '@/components/custom/FormField'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription } from '@/components/ui/field'
import { useRequestPasswordReset } from '@/api/auth/queries'

const forgotPasswordSchema = z.object({
  email: z.email('Neispravna email adresa'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

const defaultValues: ForgotPasswordFormData = {
  email: '',
}
export const Route = createFileRoute('/_auth/forgot-password/')({
  component: ForgotPasswordComponent,
})

function ForgotPasswordComponent() {

  const { mutate: requestPasswordReset, isPending } = useRequestPasswordReset()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues,
  })

  const onSubmit = (data: ForgotPasswordFormData) => {
    requestPasswordReset(data, {
      onSuccess: () => {
        reset()
      },
    })
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Posajite link za promenu lozinke</CardTitle>
        <CardDescription>
          Unesite vašu email adresu kako bismo vam poslali link za promenu lozinke
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <FormField
              required
              label="Email"
              placeholder="Unesite vašu email adresu"
              error={errors.email?.message}
              startIcon={<MailIcon />}
              {...register('email')}
            />
            <Field>
              <Button
                type="submit"
                loading={{
                  state: isPending,
                  text: 'Procesiranje...',
                }}
                className="w-full"
              >
                Posalji link za promenu lozinke
              </Button>
              <FieldDescription className="text-center">
                Nazad na <Link to="/login">Prijavu</Link>
              </FieldDescription>
            </Field>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
