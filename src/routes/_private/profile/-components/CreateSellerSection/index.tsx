import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormStepper } from './FormStepper'
import { StepOne } from './Form/StepOne'
import { StepTwo } from './Form/StepTwo'
import { StepThree } from './Form/StepThree'
import { StepFour } from './Form/StepFour'
import {
  firstStepDefaultValues,
  firstStepSchema,
} from './Form/StepOne/step-one-schema'
import {
  secondStepDefaultValues,
  secondStepSchema,
} from './Form/StepTwo/step-two-schema'
import {
  thirdStepDefaultValues,
  thirdStepSchema,
} from './Form/StepThree/step-three-schema'
import {
  fourthStepDefaultValues,
  fourthStepSchema,
} from './Form/StepFour/step-four-schema'
import type { FirstStepSchema } from './Form/StepOne/step-one-schema'
import type { SecondStepSchema } from './Form/StepTwo/step-two-schema'
import type { ThirdStepSchema } from './Form/StepThree/step-three-schema'
import type { FourthStepSchema } from './Form/StepFour/step-four-schema'
import type { CreateSellerPayload } from '@/api/sellers/types'
import { Card, CardContent } from '@/components/ui/card'
import { useCreateSeller } from '@/api/sellers/queries'

interface SellerStepperFormProps {
  userId: string | undefined
}

export function SellerStepperForm({ userId }: SellerStepperFormProps) {
  const firstStepMethods = useForm<FirstStepSchema>({
    resolver: zodResolver(firstStepSchema),
    defaultValues: firstStepDefaultValues,
  })

  const secondStepMethods = useForm<SecondStepSchema>({
    resolver: zodResolver(secondStepSchema),
    defaultValues: secondStepDefaultValues,
  })

  const thirdStepMethods = useForm<ThirdStepSchema>({
    resolver: zodResolver(thirdStepSchema),
    defaultValues: thirdStepDefaultValues,
  })

  const fourthStepMethods = useForm<FourthStepSchema>({
    resolver: zodResolver(fourthStepSchema),
    defaultValues: fourthStepDefaultValues,
  })

  const [currentStep, setCurrentStep] = useState(1)

  const { mutate: createSeller, isPending } = useCreateSeller()

  const onFourthStepSubmit = (formValues: FourthStepSchema) => {
    const firstStepData = firstStepMethods.getValues()
    const secondStepData = secondStepMethods.getValues()
    const thirdStepData = thirdStepMethods.getValues()
    const fourthStepData = formValues

    const payload = {
      ...firstStepData,
      ...secondStepData,
      ...thirdStepData,
      ...fourthStepData,
      userId: userId!,
    }

    const convertEmptyStringToNull = Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [key, value || null]),
    ) as CreateSellerPayload

    createSeller(convertEmptyStringToNull, {
      onSuccess: () => {
        firstStepMethods.reset()
        secondStepMethods.reset()
        thirdStepMethods.reset()
        fourthStepMethods.reset()
      },
    })
  }

  return (
    <Card className="overflow-hidden border-border/50 gap-0">
      <div className="bg-card/50 px-6 pb-5">
        <h1 className="text-xl font-semibold tracking-tight">
          Kreiranje prodavnice
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Popunite sve korake da biste kreirali vašu prodavnicu
        </p>
      </div>

      <FormStepper currentStep={currentStep} setCurrentStep={setCurrentStep} />

      <CardContent className="pt-5">
        {currentStep === 1 && (
          <StepOne
            setActiveStep={setCurrentStep}
            firstStepMethods={firstStepMethods}
          />
        )}
        {currentStep === 2 && (
          <StepTwo
            setActiveStep={setCurrentStep}
            secondStepMethods={secondStepMethods}
          />
        )}
        {currentStep === 3 && (
          <StepThree
            setActiveStep={setCurrentStep}
            thirdStepMethods={thirdStepMethods}
          />
        )}
        {currentStep === 4 && (
          <StepFour
            setActiveStep={setCurrentStep}
            fourthStepMethods={fourthStepMethods}
            onFourthStepSubmit={onFourthStepSubmit}
            isSubmitting={isPending}
          />
        )}
      </CardContent>
    </Card>
  )
}
