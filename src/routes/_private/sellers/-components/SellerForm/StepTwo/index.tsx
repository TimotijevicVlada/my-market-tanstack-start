import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import type { SecondStepSchema } from './zod-schema-step-two'
import { Button } from '@/components/custom/Button'
import { DialogFooter } from '@/components/ui/dialog'
import { FormField } from '@/components/custom/FormField'

interface StepTwoProps {
  setActiveStep: (step: number) => void
  secondStepMethods: UseFormReturn<SecondStepSchema>
}

export const StepTwo = ({ setActiveStep, secondStepMethods }: StepTwoProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = secondStepMethods

  const onFormSubmit = () => {
    setActiveStep(3)
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onFormSubmit)}>
      <FormField
        label="Email"
        placeholder="Unesite email"
        {...register('email')}
        error={errors.email?.message}
      />
      <FormField
        label="Telefon"
        placeholder="Unesite telefon"
        {...register('phone')}
      />
      <FormField
        label="Website"
        placeholder="https://www.example.com"
        {...register('website')}
        error={errors.website?.message}
      />
      <DialogFooter className="flex justify-between!">
        <Button variant="ghost" onClick={() => setActiveStep(1)}>
          <ChevronLeft />
          Nazad
        </Button>
        <Button variant="ghost" type="submit">
          Dalje
          <ChevronRight />
        </Button>
      </DialogFooter>
    </form>
  )
}
