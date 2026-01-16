import { useState } from 'react'
import { EyeClosedIcon, EyeIcon } from 'lucide-react'
import { Button } from './Button'
import { FormField } from './FormField'
import type { FormFieldProps } from './FormField'

export const FormFieldPassword = ({ ...props }: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <FormField
      {...props}
      type={showPassword ? 'text' : 'password'}
      endIcon={
        <Button
          variant="ghost"
          size="icon-sm"
          type="button"
          className="rounded-full"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeIcon /> : <EyeClosedIcon />}
        </Button>
      }
    />
  )
}
