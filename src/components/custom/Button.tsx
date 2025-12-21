import type { VariantProps } from 'class-variance-authority'
import type { buttonVariants } from '@/components/ui/button'
import { Button as ButtonUI } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

type ButtonUIProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

interface ButtonProps extends ButtonUIProps {
  loading?: {
    state: boolean
    text: string
  }
}

export const Button = ({ loading, ...props }: ButtonProps) => {
  return (
    <ButtonUI disabled={loading?.state} {...props}>
      {loading?.state && <Spinner />}
      {loading?.state && loading.text ? loading.text : props.children}
    </ButtonUI>
  )
}
