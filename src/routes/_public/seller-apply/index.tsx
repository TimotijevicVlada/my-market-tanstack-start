import { useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormStepper } from './-components/FormStepper'
import { StepFour } from './-components/Form/StepFour'
import {
  firstStepDefaultValues,
  firstStepSchema,
} from './-components/Form/StepOne/step-one-schema'
import { StepOne } from './-components/Form/StepOne'
import {
  fourthStepDefaultValues,
  fourthStepSchema,
} from './-components/Form/StepFour/step-four-schema'
import {
  secondStepDefaultValues,
  secondStepSchema,
} from './-components/Form/StepTwo/step-two-schema'
import { StepTwo } from './-components/Form/StepTwo'
import {
  thirdStepDefaultValues,
  thirdStepSchema,
} from './-components/Form/StepThree/step-three-schema'
import { StepThree } from './-components/Form/StepThree'
import type { FirstStepSchema } from './-components/Form/StepOne/step-one-schema'
import type { FourthStepSchema } from './-components/Form/StepFour/step-four-schema'
import type { SecondStepSchema } from './-components/Form/StepTwo/step-two-schema'
import type { ThirdStepSchema } from './-components/Form/StepThree/step-three-schema'
import type { CreateSellerPayload } from '@/api/sellers/types'
import { useCreateSellerByUser } from '@/api/sellers/queries'
import { Card, CardContent } from '@/components/ui/card'
import { getMySeller } from '@/api/sellers/server'

export const Route = createFileRoute('/_public/seller-apply/')({
  component: SellerApplyPage,
  beforeLoad: async () => {
    const seller = await getMySeller()
    if (seller) {
      throw redirect({ to: '/' })
    }
  },
})

function SellerApplyPage() {
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

  const { mutate: createSeller, isPending } = useCreateSellerByUser()

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
    <Card className="overflow-hidden border-border/50 gap-0 w-3xl mx-auto">
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
