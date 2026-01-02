import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { StepOne } from './StepOne'
import { StepTwo } from './StepTwo'
import { StepThree } from './StepThree'
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
import type { FirstStepSchema } from './StepOne/zod-schema-step-one'
import type { SecondStepSchema } from './StepTwo/zod-schema-step-two'
import type { ThirdStepSchema } from './StepThree/zod-schema-step-tree'
import type { CreateSellerPayload, Seller } from '@/api/sellers/types'
import { Stepper } from '@/components/custom/Stepper'

interface SellerFormProps {
  onFormSubmit: (data: CreateSellerPayload) => void
  isSubmitting: boolean
  type: 'create' | 'edit'
  sellerToEdit?: Seller
}

const steps = ['Opšte', 'Kontakt', 'Lokacija']

export const SellerForm = ({
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

  const onThirdStepSubmit = (formValues: ThirdStepSchema) => {
    const firstStepData = firstStepMethods.getValues()
    const secondStepData = secondStepMethods.getValues()
    const thirdStepData = formValues

    onFormSubmit({
      ...firstStepData,
      ...secondStepData,
      ...thirdStepData,
    })
  }

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
    }
  }, [sellerToEdit])

  return (
    <div>
      <Stepper steps={steps} activeStep={activeStep} />
      {activeStep === 1 && (
        <StepOne
          setActiveStep={setActiveStep}
          firstStepMethods={firstStepMethods}
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
          onThirdStepSubmit={onThirdStepSubmit}
          isSubmitting={isSubmitting}
          type={type}
        />
      )}
    </div>
  )
}
