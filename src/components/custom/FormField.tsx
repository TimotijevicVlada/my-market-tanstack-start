import { Field, FieldDescription, FieldLabel } from '../ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import type { InputHTMLAttributes, ReactNode } from 'react'

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  required?: boolean
  error?: string
  startIcon?: ReactNode
  endIcon?: ReactNode
  forgotPasswordLink?: ReactNode
  description?: string
}

export const FormField = ({
  label,
  required,
  error,
  startIcon,
  endIcon,
  forgotPasswordLink,
  description,
  ...props
}: FormFieldProps) => {
  return (
    <Field className="gap-1">
      {label && (
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <FieldLabel>{label}</FieldLabel>
            {required && <span className="text-destructive font-bold">*</span>}
          </div>
          {forgotPasswordLink}
        </div>
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
      {description && (
        <FieldDescription className="text-xs text-muted-foreground">
          {description}
        </FieldDescription>
      )}
      {error && (
        <FieldDescription className="text-destructive">
          {error}
        </FieldDescription>
      )}
    </Field>
  )
}
