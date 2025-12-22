import { Link, createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from './schema'
import type { RegisterFormData } from './schema'
import { Button } from '@/components/custom/Button'
import { useRegister } from '@/api/auth/queries'
import { FormField } from '@/components/custom/FormField'

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
    defaultValues: {
      role: 'buyer',
    },
  })

  const onSubmit = (data: RegisterFormData) => {
    register(
      {
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
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
    <section className="w-full max-w-md p-8">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-2xl font-bold text-center mb-4">Registracija</h1>

        {(error || errors.root) && (
          <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md text-sm">
            {errors.root?.message ||
              (error instanceof Error
                ? error.message
                : 'Registracija neuspešna')}
          </div>
        )}

        <FormField
          label="Korisničko ime"
          placeholder="Unesite vaše korisničko ime"
          error={errors.username?.message}
          {...registerField('username')}
        />

        <FormField
          label="Email adresa"
          placeholder="Unesite vašu email adresu"
          error={errors.email?.message}
          {...registerField('email')}
        />

        <FormField
          label="Uloga"
          placeholder="Izaberite vašu ulogu"
          error={errors.role?.message}
          {...registerField('role')}
        />

        <FormField
          label="Lozinka"
          placeholder="Unesite vašu lozinku"
          error={errors.password?.message}
          type="password"
          autoComplete="new-password"
          {...registerField('password')}
        />

        <FormField
          label="Potvrdite lozinku"
          placeholder="Potvrdite vašu lozinku"
          error={errors.confirmPassword?.message}
          type="password"
          autoComplete="new-password"
          {...registerField('confirmPassword')}
        />

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

        <div className="text-center text-sm text-muted-foreground">
          Već imate nalog?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Prijavi se
          </Link>
        </div>
      </form>
    </section>
  )
}
