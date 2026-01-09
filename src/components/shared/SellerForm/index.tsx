import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { StepOne } from './StepOne'
import { StepTwo } from './StepTwo'
import { StepThree } from './StepThree'
import { StepFour } from './StepFour'
import {
  firstStepDefaultValues,
  firstStepSchema,
} from './StepOne/zod-schema-step-one'
import {
  secondStepDefaultValues,
  secondStepSchema,
} from './StepTwo/zod-schema-step-two'
import {
  thirdStepDefaultValues,
  thirdStepSchema,
} from './StepThree/zod-schema-step-tree'
import {
  fourthStepDefaultValues,
  fourthStepSchema,
} from './StepFour/zod-schema-step-four'
import type { FirstStepSchema } from './StepOne/zod-schema-step-one'
import type { SecondStepSchema } from './StepTwo/zod-schema-step-two'
import type { ThirdStepSchema } from './StepThree/zod-schema-step-tree'
import type { CreateSellerPayload, Seller } from '@/api/sellers/types'
import type { FourthStepSchema } from './StepFour/zod-schema-step-four'
import { Stepper } from '@/components/custom/Stepper'

interface SellerFormProps {
  onFormSubmit: (data: CreateSellerPayload) => void
  isSubmitting: boolean
  type: 'create' | 'edit'
  sellerToEdit?: Seller
  userId?: string
}

const steps = ['Opšte', 'Kontakt', 'Lokacija', 'Slike']

export const SellerForm = ({
  userId,
  isSubmitting,
  type,
  onFormSubmit,
  sellerToEdit,
}: SellerFormProps) => {
  const [activeStep, setActiveStep] = useState(1)

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

    onFormSubmit(convertEmptyStringToNull)
  }

  useEffect(() => {
    if (userId) {
      firstStepMethods.reset({ userId })
    }
  }, [userId])

  useEffect(() => {
    if (sellerToEdit) {
      firstStepMethods.reset({
        userId: sellerToEdit.userId,
        displayName: sellerToEdit.displayName,
        categories: sellerToEdit.categories.map((cat) => cat.id),
        description: sellerToEdit.description,
      })
      secondStepMethods.reset({
        email: sellerToEdit.email,
        phone: sellerToEdit.phone,
        website: sellerToEdit.website,
      })
      thirdStepMethods.reset({
        country: sellerToEdit.country,
        city: sellerToEdit.city,
        address: sellerToEdit.address,
        postalCode: sellerToEdit.postalCode,
      })
      fourthStepMethods.reset({
        avatarUrl: sellerToEdit.avatarUrl,
        coverImageUrl: sellerToEdit.coverImageUrl,
      })
    }
  }, [sellerToEdit])

  return (
    <div>
      <Stepper steps={steps} activeStep={activeStep} />
      {activeStep === 1 && (
        <StepOne
          setActiveStep={setActiveStep}
          firstStepMethods={firstStepMethods}
          userId={userId}
        />
      )}
      {activeStep === 2 && (
        <StepTwo
          setActiveStep={setActiveStep}
          secondStepMethods={secondStepMethods}
        />
      )}
      {activeStep === 3 && (
        <StepThree
          setActiveStep={setActiveStep}
          thirdStepMethods={thirdStepMethods}
        />
      )}
      {activeStep === 4 && (
        <StepFour
          setActiveStep={setActiveStep}
          fourthStepMethods={fourthStepMethods}
          isSubmitting={isSubmitting}
          type={type}
          onFourthStepSubmit={onFourthStepSubmit}
        />
      )}
    </div>
  )
}
