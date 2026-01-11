import { ChevronLeft, ChevronRight, Mail } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import type { SecondStepSchema } from './step-two-schema'
import { Button } from '@/components/custom/Button'
import { FormField } from '@/components/custom/FormField'
import { DialogFooter } from '@/components/ui/dialog'
import { SectionHead } from '@/components/custom/SectionHead'

interface StepTwoProps {
  setActiveStep: (step: number) => void
  secondStepMethods: UseFormReturn<SecondStepSchema>
}

export const StepTwo = ({ setActiveStep, secondStepMethods }: StepTwoProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = secondStepMethods

  const onFormSubmit = () => {
    setActiveStep(3)
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onFormSubmit)}>
      <SectionHead
        Icon={Mail}
        title="Kontakt informacije"
        description="Kako vas kupci mogu kontaktirati"
        className="pb-2"
      />
      <div className="flex flex-col gap-5">
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
          <div className="flex gap-2">
            <Button variant="ghost" type="button" onClick={() => reset()}>
              Poništi
            </Button>
            <Button type="submit">
              Dalje
              <ChevronRight />
            </Button>
          </div>
        </DialogFooter>
      </div>
    </form>
  )
}
