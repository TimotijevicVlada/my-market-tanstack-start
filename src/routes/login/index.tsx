import { Link, createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EyeClosedIcon, EyeIcon, LockIcon, MailIcon } from 'lucide-react'
import { useState } from 'react'
import { loginSchema } from './schema'
import type { LoginFormData } from './schema'
import { Button } from '@/components/custom/Button'
import { useLogin } from '@/api/auth/queries'
import { FormField } from '@/components/custom/FormField'

export const Route = createFileRoute('/login/')({
  component: LoginComponent,
})

function LoginComponent() {
  const { mutate: login, isPending, error } = useLogin()

  const [showPassword, setShowPassword] = useState(false)

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
    <div className="min-h-screen bg-background flex justify-center">
      <section className="w-full max-w-md p-8">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-2xl font-bold text-center mb-4">Prijava</h1>
          {(error || errors.root) && (
            <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md text-sm">
              {errors.root?.message ||
                (error instanceof Error ? error.message : 'Prijava neuspešna')}
            </div>
          )}
          <FormField
            label="Email"
            placeholder="Unesite vašu email adresu"
            error={errors.email?.message}
            startIcon={<MailIcon />}
            {...register('email')}
          />
          <FormField
            label="Password"
            placeholder="Unesite vašu lozinku"
            error={errors.password?.message}
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            startIcon={<LockIcon />}
            endIcon={
              <Button
                variant="ghost"
                size="icon-sm"
                type="button"
                className="rounded-full"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeIcon /> : <EyeClosedIcon />}
              </Button>
            }
            {...register('password')}
          />
          <Button
            type="submit"
            loading={{
              state: isPending,
              text: 'Prijavljivanje...',
            }}
            className="w-full"
          >
            Prijavi se
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Nemate nalog?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Registruj se
            </Link>
          </div>
        </form>
      </section>
    </div>
  )
}
