import { Label } from '../ui/label'
import { Textarea as TextareaUI } from '../ui/textarea'
import { FieldDescription } from '../ui/field'
import type { TextareaHTMLAttributes } from 'react'

interface TextProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  required?: boolean
  error?: string
}

export const Textarea = ({ label, required, error, ...props }: TextProps) => {
  return (
    <div>
      {label && (
        <Label className="mb-2">
          {label}
          {required && <span className="text-destructive font-bold">*</span>}
        </Label>
      )}
      <TextareaUI className="h-30 resize-none" {...props} />
      {error && (
        <FieldDescription className="text-destructive">
          {error}
        </FieldDescription>
      )}
    </div>
  )
}
