import { z } from 'zod';
import { useMemo, useState } from 'react';
import { Check, LockIcon, Unlink } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/custom/Button';
import { Input } from '@/components/ui/input';
import { SectionHead } from '@/components/custom/SectionHead';
import { useDisconnectProvider, useGetLinkedAccounts, useLinkAccountWithCredentials } from '@/api/auth/queries';

const passwordSchema = z.object({
  password: z.string().min(1, 'Lozinka je obavezna'),
})

type PasswordFormData = z.infer<typeof passwordSchema>

const CREDENTIAL = 'credential'

export const Credentials = () => {
  const [showPasswordField, setShowPasswordField] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
    },
  })

  const { mutate: linkAccountWithCredentials } = useLinkAccountWithCredentials()
  const { data: linkedAccounts, refetch: refetchLinkedAccounts } =
    useGetLinkedAccounts()
  const { mutate: disconnectCredential } = useDisconnectProvider(CREDENTIAL)

  const handleDisconnectProvider = () => {
    const accountId = linkedAccounts?.find(
      (account) => account.providerId === CREDENTIAL,
    )?.accountId

    disconnectCredential(accountId, {
      onSuccess: () => {
        refetchLinkedAccounts()
      },
    })
  }

  const onPasswordSubmit = (password: PasswordFormData) => {
    linkAccountWithCredentials(password, {
      onSuccess: () => {
        refetchLinkedAccounts()
        setShowPasswordField(false)
        reset()
      },
    })
  }

  const hasLinkedCredentials = useMemo(() => linkedAccounts?.some((account) => account.providerId === CREDENTIAL), [linkedAccounts])

  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
      <SectionHead
        Icon={LockIcon}
        title="Email i lozinka"
        description={hasLinkedCredentials
          ? 'Možete se prijaviti sa email adresom i lozinkom'
          : 'Nemate postavljenu lozinku'}
      />
      <div className="flex items-center gap-3">
        {hasLinkedCredentials ? (
          <>
            <Badge
              variant="outline"
              className="gap-1.5 border-green-500/30 bg-green-500/10 text-green-500"
            >
              <Check className="size-3" />
              Povezano
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => handleDisconnectProvider()}
            >
              <Unlink className="size-3.5" />
              Prekini vezu
            </Button>
          </>
        ) : showPasswordField ? (
          <form
            className="flex items-center gap-2"
            onSubmit={handleSubmit(onPasswordSubmit)}
          >
            <Input
              type="password"
              placeholder="Lozinka"
              {...register('password')}
            />
            <Button
              size="sm"
              type="submit"
            >
              Sačuvaj
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPasswordField(false)}
            >
              Odustani
            </Button>
          </form>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 bg-transparent"
            onClick={() => setShowPasswordField(true)}
          >
            <LockIcon className="size-3.5" />
            Postavi lozinku
          </Button>
        )}
      </div>
    </div>
  )
};