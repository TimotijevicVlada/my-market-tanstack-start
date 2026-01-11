import { Check } from 'lucide-react'
import { STEPS } from './data'
import type { Dispatch, SetStateAction } from 'react'
import { cn } from '@/lib/utils'

interface FormStepperProps {
  currentStep: number
  setCurrentStep: Dispatch<SetStateAction<number>>
}

export const FormStepper = ({
  currentStep,
  setCurrentStep,
}: FormStepperProps) => {
  return (
    <div className="border-b border-t border-border/50 bg-muted/30 px-6 py-5">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const StepIcon = step.icon
          const isActive = currentStep === step.id
          const isCompleted = currentStep > step.id

          return (
            <div key={step.id} className="flex flex-1 items-center">
              <button
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  'group flex flex-col items-center gap-2 transition-all',
                  isActive || isCompleted ? 'cursor-pointer' : 'cursor-default',
                )}
              >
                <div
                  className={cn(
                    'flex size-10 items-center justify-center rounded-xl border-2 transition-all md:size-12',
                    isCompleted
                      ? 'border-primary bg-primary text-primary-foreground'
                      : isActive
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-muted/50 text-muted-foreground',
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-5" />
                  ) : (
                    <StepIcon className="size-5" />
                  )}
                </div>
                <div className="text-center">
                  <p
                    className={cn(
                      'text-sm font-medium transition-colors',
                      isActive || isCompleted
                        ? 'text-foreground'
                        : 'text-muted-foreground',
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="hidden text-xs text-muted-foreground md:block">
                    {step.description}
                  </p>
                </div>
              </button>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'mx-2 h-0.5 flex-1 rounded-full transition-colors md:mx-4',
                    currentStep > step.id ? 'bg-primary' : 'bg-border',
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
