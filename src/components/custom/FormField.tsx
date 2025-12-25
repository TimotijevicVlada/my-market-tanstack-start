import { Field, FieldDescription, FieldLabel } from '../ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import type { InputHTMLAttributes, ReactNode } from 'react'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  required?: boolean
  error?: string
  startIcon?: ReactNode
  endIcon?: ReactNode
}

export const FormField = ({
  label,
  required,
  error,
  startIcon,
  endIcon,
  ...props
}: FormFieldProps) => {
  return (
    <Field className="gap-1">
      {label && (
        <FieldLabel>
          {label}
          {required && <span className="text-destructive font-bold">*</span>}
        </FieldLabel>
      )}
      <InputGroup>
        <InputGroupInput {...props} />
        {startIcon && (
          <InputGroupAddon align="inline-start">{startIcon}</InputGroupAddon>
        )}
        {endIcon && (
          <InputGroupAddon align="inline-end">{endIcon}</InputGroupAddon>
        )}
      </InputGroup>
      {error && (
        <FieldDescription className="text-destructive">
          {error}
        </FieldDescription>
      )}
    </Field>
  )
}
