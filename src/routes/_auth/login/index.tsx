import { Link, createFileRoute, } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LockIcon, MailIcon } from 'lucide-react'
import { loginSchema } from './-schema'
import type { LoginFormData } from './-schema'
import { Button } from '@/components/custom/Button'
import { useFacebookSignIn, useGoogleSignIn, useLogin } from '@/api/auth/queries'
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
  FieldSeparator,
} from "@/components/ui/field"

export const Route = createFileRoute('/_auth/login/')({
  component: LoginComponent,
})

function LoginComponent() {
  const { mutate: login, isPending, error } = useLogin()
  const { mutate: googleLogin, isPending: isGoogleLoginPending } = useGoogleSignIn()
  const { mutate: facebookLogin, isPending: isFacebookLoginPending } = useFacebookSignIn()

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
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  loading={{ state: isGoogleLoginPending, text: 'Google prijava...' }}
                  onClick={() => googleLogin()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Google prijava
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  loading={{ state: isFacebookLoginPending, text: 'Facebook prijava...' }}
                  onClick={() => facebookLogin()}
                >
                  <svg fill="currentColor" width="800px" height="800px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" stroke-width="0" />
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                    <g id="SVGRepo_iconCarrier"> <path d="m1416.013 791.915-30.91 225.617h-371.252v789.66H788.234v-789.66H449.808V791.915h338.426V585.137c0-286.871 176.207-472.329 449.09-472.329 116.87 0 189.744 6.205 231.822 11.845l-3.272 213.66-173.5.338c-4.737-.451-117.771-9.25-199.332 65.655-52.568 48.169-79.191 117.433-79.191 205.65v181.96h402.162Zm-247.276-304.018c44.446-41.401 113.71-36.889 118.787-36.663l289.467-.113 6.204-417.504-43.544-10.717C1511.675 16.02 1426.053 0 1237.324 0 901.268 0 675.425 235.206 675.425 585.137v93.97H337v451.234h338.425V1920h451.234v-789.66h356.7l61.932-451.233H1126.66v-69.152c0-54.937 14.214-96 42.078-122.058Z" fill-rule="evenodd" /> </g>
                  </svg>
                  Facebook prijava
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Ili nastavite sa
              </FieldSeparator>
              <div className="flex flex-col gap-4">
                {(error || errors.root) && (
                  <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md text-sm">
                    {errors.root?.message ||
                      (error instanceof Error ? error.message : 'Prijava neuspešna')}
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
                  forgotPasswordLink={<a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">Zaboravili ste lozinku?</a>}
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
        Klikom na nastavak, slažete se sa našim <a href="#">Uslovima korišćenja</a>{" "}
        i <a href="#">Politikom privatnosti</a>.
      </FieldDescription>
    </div>
  )
}
