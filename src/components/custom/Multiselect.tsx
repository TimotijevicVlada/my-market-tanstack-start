import { FieldDescription } from '../ui/field'
import { Label } from '../ui/label'
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/components/ui/multi-select'

interface MultiselectProps<T> {
  label?: string
  placeholder?: string
  options: Array<T>
  onValuesChange: (values: Array<string>) => void
  keys: {
    label: keyof T
    value: keyof T
  }
  values?: Array<string>
  overflowBehavior?: 'wrap' | 'wrap-when-open' | 'cutoff'
  required?: boolean
  error?: string
}

export const Multiselect = <T,>({
  required,
  label,
  placeholder,
  options,
  keys,
  onValuesChange,
  values = [],
  overflowBehavior = 'wrap-when-open',
  error,
}: MultiselectProps<T>) => {
  return (
    <div>
      {label && (
        <Label className="mb-2">
          {label}
          {required && <span className="text-destructive font-bold">*</span>}
        </Label>
      )}
      <MultiSelect values={values} onValuesChange={onValuesChange}>
        <MultiSelectTrigger className="w-full">
          <MultiSelectValue
            placeholder={placeholder}
            overflowBehavior={overflowBehavior}
          />
        </MultiSelectTrigger>
        <MultiSelectContent>
          <MultiSelectGroup>
            {options.map((option) => {
              const value = option[keys.value] as string
              return (
                <MultiSelectItem key={value} value={value}>
                  {option[keys.label] as string}
                </MultiSelectItem>
              )
            })}
          </MultiSelectGroup>
        </MultiSelectContent>
      </MultiSelect>
      {error && (
        <FieldDescription className="text-destructive">
          {error}
        </FieldDescription>
      )}
    </div>
  )
}
