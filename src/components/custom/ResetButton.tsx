import { RefreshCcw } from 'lucide-react'
import { useState } from 'react'
import type { VariantProps } from 'class-variance-authority'
import type { buttonVariants } from '@/components/ui/button'
import { Button as ButtonUI } from '@/components/ui/button'

type ResetButtonUIProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants>

export const ResetButton = ({ ...props }: ResetButtonUIProps) => {
  const [isResetting, setIsResetting] = useState(false)

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsResetting(true)
    props.onClick?.(e)
    setTimeout(() => {
      setIsResetting(false)
    }, 600)
  }

  return (
    <ButtonUI {...props} onClick={handleReset}>
      <RefreshCcw
        className={`${isResetting ? 'animate-[spin-once_0.6s_ease-in-out]' : ''} border-1 border-transparent`}
      />
      Poništi
    </ButtonUI>
  )
}
