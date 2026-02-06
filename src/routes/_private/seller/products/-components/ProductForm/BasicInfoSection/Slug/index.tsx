import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import slugify from 'slugify'
import type { ProductFormSchema } from '../../zod-schema'
import { FormField } from '@/components/custom/FormField'

export const Slug = () => {
  const { register, control, setValue } = useFormContext<ProductFormSchema>()

  const name = useWatch({ control, name: 'name' })

  useEffect(() => {
    if (name) {
      const generatedSlug = slugify(name, {
        lower: true,
        strict: true,
        locale: 'sr',
      })
      setValue('slug', generatedSlug)
    }
  }, [name, setValue])

  return (
    <div>
      <FormField label="URL slug" required {...register('slug')} />
      <p className="text-xs text-muted-foreground">
        Automatski generisan iz naziva
      </p>
    </div>
  )
}
