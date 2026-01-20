import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { createUserDefaultValues, createUserSchema } from '../zod-schema'
import { UserForm } from '../UserForm'
import type { CreateUserSchema } from '../zod-schema'
// import type { GetUsersParams } from '@/api/users/types'
import { Button } from '@/components/custom/Button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
// import { useCreateUser } from '@/api/users/queries'

export const CreateUser = () => {
  const [isOpen, setIsOpen] = useState(false)

  const methods = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: createUserDefaultValues,
  })


  // const { mutate: createUser, isPending } = useCreateUser(params)

  const onFormSubmit = () => {
    // createUser(data, {
    //   onSuccess: () => {
    //     reset()
    //     setIsOpen(false)
    //   },
    // })
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PlusIcon />
        Dodaj korisnika
      </Button>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Kreiranje korisnika</DialogTitle>
            <Separator />
          </DialogHeader>
          <FormProvider {...methods}>
            <UserForm
              onFormSubmit={onFormSubmit}
              isSubmitting={false}
              type="create"
            />
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  )
}
