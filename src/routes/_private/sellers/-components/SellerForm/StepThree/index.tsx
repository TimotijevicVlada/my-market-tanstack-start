import { ChevronLeft } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import type { ThirdStepSchema } from './zod-schema-step-tree'
import { DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/custom/Button'
import { FormField } from '@/components/custom/FormField'

interface StepThreeProps {
  setActiveStep: (step: number) => void
  isSubmitting: boolean
  type: 'create' | 'edit'
  thirdStepMethods: UseFormReturn<ThirdStepSchema>
  onThirdStepSubmit: (formValues: ThirdStepSchema) => void
}

export const StepThree = ({
  setActiveStep,
  isSubmitting,
  type,
  thirdStepMethods,
  onThirdStepSubmit,
}: StepThreeProps) => {
  const { handleSubmit, register } = thirdStepMethods

  const onFormSubmit = (formValues: ThirdStepSchema) => {
    onThirdStepSubmit(formValues)
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
        <Button
          type="submit"
          loading={{
            state: isSubmitting,
            text: type === 'create' ? 'Kreiranje...' : 'Izmena...',
          }}
        >
          {type === 'create' ? 'Sacuvaj' : 'Izmeni'}
        </Button>
      </DialogFooter>
    </form>
  )
}
