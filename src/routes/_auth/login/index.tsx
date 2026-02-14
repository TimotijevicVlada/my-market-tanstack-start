import { Link, createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LockIcon, MailIcon } from 'lucide-react'
import { OauthButtons } from '../-components/OauthButtons'
import { loginSchema } from './-schema'
import type { LoginFormData } from './-schema'
import { Button } from '@/components/custom/Button'
import { useLogin } from '@/api/auth/queries'
import { FormField } from '@/components/custom/FormField'
import { FormFieldPassword } from '@/components/custom/FormFieldPassword'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from '@/components/ui/field'

export const Route = createFileRoute('/_auth/login/')({
  component: LoginComponent,
})

function LoginComponent() {
  const { mutate: login, isPending, error } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    login(
      {
        email: data.email,
        password: data.password,
      },
      {
        onError: (err) => {
          setError('root', {
            message: err.message || 'Prijava neuspešna',
          })
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Dobrodošli nazad</CardTitle>
          <CardDescription>
            Prijavite se pomoću Google ili Facebook naloga
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <OauthButtons />
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Ili nastavite sa
              </FieldSeparator>
              <div className="flex flex-col gap-4">
                {(error || errors.root) && (
                  <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md text-sm">
                    {errors.root?.message ||
                      (error instanceof Error
                        ? error.message
                        : 'Prijava neuspešna')}
                  </div>
                )}
                <FormField
                  required
                  label="Email"
                  placeholder="Unesite vašu email adresu"
                  error={errors.email?.message}
                  startIcon={<MailIcon />}
                  {...register('email')}
                />
                <FormFieldPassword
                  required
                  label="Lozinka"
                  placeholder="Unesite vašu lozinku"
                  error={errors.password?.message}
                  autoComplete="current-password"
                  startIcon={<LockIcon />}
                  forgotPasswordLink={
                    <Link
                      to="/forgot-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Zaboravili ste lozinku?
                    </Link>
                  }
                  {...register('password')}
                />
                <Field>
                  <Button
                    type="submit"
                    loading={{
                      state: isPending,
                      text: 'Prijavljivanje...',
                    }}
                  >
                    Prijavi se
                  </Button>
                  <FieldDescription className="text-center">
                    Nemate nalog? <Link to="/register">Registruj se</Link>
                  </FieldDescription>
                </Field>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Klikom na nastavak, slažete se sa našim{' '}
        <a href="#">Uslovima korišćenja</a> i{' '}
        <a href="#">Politikom privatnosti</a>.
      </FieldDescription>
    </div>
  )
}
