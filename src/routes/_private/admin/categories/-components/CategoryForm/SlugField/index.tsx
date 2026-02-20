import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import slugify from 'slugify'
import type { CategorySchema } from '../../zod-schema'
import { FormField } from '@/components/custom/FormField'

export const SlugField = () => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<CategorySchema>()

  const name = useWatch({ control, name: 'name' })

  useEffect(() => {
    if (name) {
      const generatedSlug = slugify(name, {
        lower: true,
        strict: true,
        locale: 'sr',
      })
      setValue('slug', generatedSlug, {
        shouldValidate: true,
      })
    }
  }, [name, setValue])

  return (
    <FormField
      label="URL slug"
      required
      {...register('slug')}
      error={errors.slug?.message}
      description="Automatski generisan iz naziva"
    />
  )
}
