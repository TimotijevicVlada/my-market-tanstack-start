import { useMemo } from "react";
import { Check, Link2, Unlink } from "lucide-react";
import { Button } from "@/components/custom/Button";
import { Badge } from "@/components/ui/badge";
import { useConnectProvider, useDisconnectProvider, useGetLinkedAccounts } from "@/api/auth/queries";

const FACEBOOK = 'facebook'

export const FacebookAccount = () => {

  const { data: linkedAccounts, refetch: refetchLinkedAccounts } =
    useGetLinkedAccounts()
  const { mutate: connectFacebook } = useConnectProvider(FACEBOOK)
  const { mutate: disconnectFacebook } = useDisconnectProvider(FACEBOOK)

  const handleDisconnectProvider = () => {
    const accountId = linkedAccounts?.find(
      (account) => account.providerId === FACEBOOK,
    )?.accountId

    disconnectFacebook(accountId, {
      onSuccess: () => {
        refetchLinkedAccounts()
      },
    })
  }

  const hasLinkedFacebook = useMemo(() => linkedAccounts?.some((account) => account.providerId === FACEBOOK), [linkedAccounts])

  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
      <div className="flex items-center gap-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-[#1877F2]">
          <svg
            className="size-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </div>
        <div>
          <p className="font-medium">Facebook</p>
          <p className="text-sm text-muted-foreground">
            {hasLinkedFacebook
              ? 'Povezano sa vašim Facebook nalogom'
              : 'Nije povezano'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {hasLinkedFacebook ? (
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
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 bg-transparent"
            onClick={() => connectFacebook()}
          >
            <Link2 className="size-3.5" />
            Poveži
          </Button>
        )}
      </div>
    </div>
  )
};