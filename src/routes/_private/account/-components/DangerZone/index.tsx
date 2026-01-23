import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/custom/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog } from "@/components/custom/AlertDialog";
import { useDeleteUser } from "@/api/auth/queries";

export const DangerZone = () => {

  const { mutate: deleteUser, isPending } = useDeleteUser()

  const [alertIsOpen, setAlertIsOpen] = useState(false)

  const handleDeleteUser = () => {
    deleteUser(undefined, {
      onSuccess: () => {
        setAlertIsOpen(false)
      }
    })

  }

  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10">
            <AlertTriangle className="size-5 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-lg text-destructive">Obrišite vaš nalog</CardTitle>
            <CardDescription>Trajno uklonite vaš nalog i sve podatke</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 size-5 flex-shrink-0 text-destructive" />
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-destructive">Upozorenje: Ova akcija je nepovratna</p>
              <p className="text-muted-foreground">
                Brisanjem naloga trajno ćete izgubiti pristup svim vašim podacima. Ovo uključuje:
              </p>
            </div>
          </div>
        </div>

        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 size-1.5 flex-shrink-0 rounded-full bg-destructive" />
            <span>Svi vaši lični podaci i informacije o nalogu</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 size-1.5 flex-shrink-0 rounded-full bg-destructive" />
            <span>Istorija kupovine i sve vaše porudžbine</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 size-1.5 flex-shrink-0 rounded-full bg-destructive" />
            <span>Lista omiljenih proizvoda i sačuvane adrese</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 size-1.5 flex-shrink-0 rounded-full bg-destructive" />
            <span>Povezani nalozi (Google, Facebook) će biti odspojeni</span>
          </li>
        </ul>

        <div className="border-t border-destructive/20 pt-4">
          <p className="mb-4 text-sm text-muted-foreground">
            Ako ste sigurni da želite da obrišete nalog, kliknite na dugme ispod. Bićete zamoljeni da potvrdite ovu akciju preko vaše email adrese.
          </p>
          <Button
            variant="destructive"
            onClick={() => setAlertIsOpen(true)}
          >
            <Trash2 className="size-4" />
            Obriši moj nalog
          </Button>
        </div>
        <AlertDialog
          open={alertIsOpen}
          onOpenChange={() => setAlertIsOpen(false)}
          title="Potvrdite slanje linka za brisanje naloga"
          description="Bićete zamoljeni da potvrdite ovu akciju preko vaše email adrese."
          onConfirm={handleDeleteUser}
          onCancel={() => setAlertIsOpen(false)}
          confirmText="Pošalji link"
          loading={{
            state: isPending,
            text: 'Slanje linka...',
          }}
        />
      </CardContent>
    </Card>
  )
};