import {
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperTitle,
  StepperTrigger,
  Stepper as StepperUI,
} from '@/components/ui/stepper'

interface StepperProps {
  steps: Array<string>
  activeStep: number
}

export const Stepper = ({ steps, activeStep }: StepperProps) => {
  return (
    <StepperUI defaultValue={1} value={activeStep} className="space-y-8">
      <StepperNav className="gap-3.5 mb-7">
        {steps.map((step, index) => {
          return (
            <StepperItem
              key={index}
              step={index + 1}
              className="relative flex-1 items-start"
            >
              <StepperTrigger className="flex flex-col items-start justify-center gap-3.5 grow">
                <StepperIndicator className="bg-border rounded-full h-1 w-full data-[state=active]:bg-primary" />
                <div className="flex flex-col items-start gap-1">
                  <StepperTitle className="text-start font-semibold group-data-[state=inactive]/step:text-muted-foreground">
                    {step}
                  </StepperTitle>
                </div>
              </StepperTrigger>
            </StepperItem>
          )
        })}
      </StepperNav>

      <StepperPanel className="text-sm">
        {steps.map((step, index) => (
          <StepperContent
            key={index}
            value={index + 1}
            className="flex items-center justify-center text-lg mb-3"
          >
            {step}
          </StepperContent>
        ))}
      </StepperPanel>
    </StepperUI>
  )
}
