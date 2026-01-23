import z from 'zod'
import { Link, createFileRoute, useSearch } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription } from '@/components/ui/field'
import { Button } from '@/components/custom/Button'
import { FormFieldPassword } from '@/components/custom/FormFieldPassword'
import { useResetPassword } from '@/api/auth/queries'

const resetPasswordSearchSchema = z.object({
    token: z.string(),
})

export const Route = createFileRoute('/_auth/reset-password/')({
    component: ResetPasswordComponent,
    validateSearch: resetPasswordSearchSchema,
})

const resetPasswordSchema = z.object({
    password: z.string().min(1, 'Lozinka je obavezna'),
    confirmPassword: z.string().min(1, 'Potvrda lozinke je obavezna'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Lozinke se ne podudaraju',
    path: ['confirmPassword'],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

const defaultValues: ResetPasswordFormData = {
    password: '',
    confirmPassword: '',
}

function ResetPasswordComponent() {

    const { token } = useSearch({ from: '/_auth/reset-password/' })
    const navigate = Route.useNavigate()

    const { mutate: resetPassword, isPending } = useResetPassword()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues,
    })

    const onSubmit = (data: ResetPasswordFormData) => {
        resetPassword({
            newPassword: data.password,
            token,
        }, {
            onSuccess: () => {
                reset()
                navigate({ to: '/login' })
            },
        })
    }

    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Resetuj lozinku</CardTitle>
                <CardDescription>
                    Unesite novu lozinku
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4">
                        <FormFieldPassword
                            required
                            label="Lozinka"
                            placeholder="Unesite novu lozinku"
                            error={errors.password?.message}
                            startIcon={<ShieldCheck />}
                            {...register('password')}
                        />
                        <FormFieldPassword
                            required
                            label="Potvrdi lozinku"
                            placeholder="Potvrdite novu lozinku"
                            error={errors.confirmPassword?.message}
                            startIcon={<ShieldCheck />}
                            {...register('confirmPassword')}
                        />
                        <Field>
                            <Button
                                type="submit"
                                loading={{
                                    state: isPending,
                                    text: 'Resetovanje...',
                                }}
                                className="w-full"
                            >
                                Resetuj lozinku
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
