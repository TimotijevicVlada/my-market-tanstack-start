import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { ThirdStepSchema } from './step-three-schema'
import { FormField } from '@/components/custom/FormField'
import { DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/custom/Button'
import { SectionHead } from '@/components/custom/SectionHead'

interface StepThreeProps {
  setActiveStep: Dispatch<SetStateAction<number>>
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
    <form className="space-y-6" onSubmit={handleSubmit(onFormSubmit)}>
      <SectionHead
        Icon={MapPin}
        title="Lokacija"
        description="Adresa vaše prodavnice"
        className="pb-2"
      />

      <div className="flex flex-col gap-5">
        <div className="flex gap-4">
          <div className="flex-1">
            <FormField
              label="Država"
              placeholder="Unesite državu"
              {...register('country')}
            />
          </div>

          <div className="flex-1">
            <FormField
              label="Grad"
              placeholder="Unesite grad"
              {...register('city')}
            />
          </div>
        </div>

        <FormField
          label="Adresa"
          placeholder="Unesite adresu"
          {...register('address')}
        />

        <div className="flex gap-4">
          <div className="flex-1">
            <FormField
              label="Poštanski broj"
              placeholder="Unesite poštanski broj"
              {...register('postalCode')}
            />
          </div>
          <div className="flex-1" />
        </div>

        <DialogFooter className="flex justify-between!">
          <Button variant="ghost" onClick={() => setActiveStep(2)}>
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
