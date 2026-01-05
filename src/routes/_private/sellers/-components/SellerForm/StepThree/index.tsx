import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import type { ThirdStepSchema } from './zod-schema-step-tree'
import { DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/custom/Button'
import { FormField } from '@/components/custom/FormField'

interface StepThreeProps {
  setActiveStep: (step: number) => void
  thirdStepMethods: UseFormReturn<ThirdStepSchema>
}

export const StepThree = ({
  setActiveStep,
  thirdStepMethods,
}: StepThreeProps) => {
  const { handleSubmit, register, reset } = thirdStepMethods

  const onFormSubmit = () => {
    setActiveStep(4)
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onFormSubmit)}>
      <FormField
        label="Država"
        placeholder="Unesite državu"
        {...register('country')}
      />
      <FormField
        label="Grad"
        placeholder="Unesite grad"
        {...register('city')}
      />
      <FormField
        label="Adresa"
        placeholder="Unesite adresu"
        {...register('address')}
      />
      <FormField
        label="Poštanski broj"
        placeholder="Unesite poštanski broj"
        {...register('postalCode')}
      />
      <DialogFooter className="flex justify-between!">
        <Button variant="ghost" onClick={() => setActiveStep(2)}>
          <ChevronLeft />
          Nazad
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" type="button" onClick={() => reset()}>
            Poništi
          </Button>
          <Button variant="ghost" type="submit">
            Dalje
            <ChevronRight />
          </Button>
        </div>
      </DialogFooter>
    </form>
  )
}
