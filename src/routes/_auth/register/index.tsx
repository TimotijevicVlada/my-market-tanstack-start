import { Link, createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MailIcon, ShieldEllipsis, UserIcon } from 'lucide-react'
import { defaultValues, registerSchema } from './-schema'
import type { RegisterFormData } from './-schema'
import { Button } from '@/components/custom/Button'
import { useRegister } from '@/api/auth/queries'
import { FormField } from '@/components/custom/FormField'
import { FormFieldPassword } from '@/components/custom/FormFieldPassword'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"

export const Route = createFileRoute('/_auth/register/')({
  component: RegisterComponent,
})

function RegisterComponent() {
  const { mutate: register, isPending, error } = useRegister()

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues,
  })

  const onSubmit = (data: RegisterFormData) => {
    register(
      {
        username: data.username,
        email: data.email,
        password: data.password,
      },
      {
        onError: (err) => {
          setError('root', {
            message: err.message || 'Registracija neuspešna',
          })
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Kreirajte svoj nalog</CardTitle>
          <CardDescription>
            Unesite podatke da biste kreirali svoj nalog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col gap-4">
                {(error || errors.root) && (
                  <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md text-sm">
                    {errors.root?.message ||
                      (error instanceof Error
                        ? error.message
                        : 'Registracija neuspešna')}
                  </div>
                )}
                <FormField
                  required
                  label="Korisničko ime"
                  placeholder="Unesite vaše korisničko ime"
                  error={errors.username?.message}
                  startIcon={<UserIcon />}
                  {...registerField('username')}
                />
                <FormField
                  required
                  label="Email adresa"
                  placeholder="Unesite vašu email adresu"
                  error={errors.email?.message}
                  startIcon={<MailIcon />}
                  {...registerField('email')}
                />
                <FormFieldPassword
                  required
                  label="Lozinka"
                  placeholder="Unesite vašu lozinku"
                  error={errors.password?.message}
                  startIcon={<ShieldEllipsis />}
                  autoComplete="new-password"
                  forgotPasswordLink={<span className="ml-auto text-sm">Minimum 6 karaktera</span>}
                  {...registerField('password')}
                />
                <FormFieldPassword
                  required
                  label="Potvrdite lozinku"
                  placeholder="Potvrdite vašu lozinku"
                  error={errors.confirmPassword?.message}
                  startIcon={<ShieldEllipsis />}
                  autoComplete="new-password"
                  {...registerField('confirmPassword')}
                />
                <Field>
                  <Button
                    type="submit"
                    loading={{
                      state: isPending,
                      text: 'Registracija...',
                    }}
                    className="w-full"
                  >
                    Registruj se
                  </Button>
                  <FieldDescription className="text-center">
                    Već imate nalog? <Link to="/login">Prijavi se</Link>
                  </FieldDescription>
                </Field>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Klikom na Registruj se, slažete se sa našim <a href="#">Uslovima korišćenja</a>{" "}
        i <a href="#">Politikom privatnosti</a>.
      </FieldDescription>
    </div>
  )
}
