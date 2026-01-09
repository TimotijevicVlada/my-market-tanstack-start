import * as React from 'react'
import { cva } from 'class-variance-authority'
import { X } from 'lucide-react'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  'flex items-stretch w-full gap-2 group-[.toaster]:w-(--width)',
  {
    variants: {
      variant: {
        secondary: '',
        primary: '',
        destructive: '',
        success: '',
        info: '',
        mono: '',
        warning: '',
      },
      icon: {
        primary: '',
        destructive: '',
        success: '',
        info: '',
        warning: '',
      },
      appearance: {
        solid: '',
        outline: '',
        light: '',
        stroke: 'text-foreground',
      },
      size: {
        lg: 'rounded-lg p-4 gap-3 text-base [&>[data-slot=alert-icon]>svg]:size-6 *:data-slot=alert-icon:mt-0.5 [&_[data-slot=alert-close]]:mt-1',
        md: 'rounded-lg p-3.5 gap-2.5 text-sm [&>[data-slot=alert-icon]>svg]:size-5 *:data-slot=alert-icon:mt-0 [&_[data-slot=alert-close]]:mt-0.5',
        sm: 'rounded-md px-3 py-2.5 gap-2 text-xs [&>[data-slot=alert-icon]>svg]:size-4 *:data-alert-icon:mt-0.5 [&_[data-slot=alert-close]]:mt-0.25 [&_[data-slot=alert-close]_svg]:size-3.5',
      },
    },
    compoundVariants: [
      /* Solid */
      {
        variant: 'secondary',
        appearance: 'solid',
        className: 'bg-muted text-foreground',
      },
      {
        variant: 'primary',
        appearance: 'solid',
        className: 'bg-primary text-primary-foreground',
      },
      {
        variant: 'destructive',
        appearance: 'solid',
        className: 'bg-destructive text-destructive-foreground',
      },
      {
        variant: 'success',
        appearance: 'solid',
        className:
          'bg-[var(--color-success,var(--color-green-500))] text-[var(--color-success-foreground,var(--color-white))]',
      },
      {
        variant: 'info',
        appearance: 'solid',
        className:
          'bg-[var(--color-info,var(--color-violet-600))] text-[var(--color-info-foreground,var(--color-white))]',
      },
      {
        variant: 'warning',
        appearance: 'solid',
        className:
          'bg-[var(--color-warning,var(--color-yellow-500))] text-[var(--color-warning-foreground,var(--color-white))]',
      },
      {
        variant: 'mono',
        appearance: 'solid',
        className:
          'bg-zinc-950 text-white dark:bg-zinc-300 dark:text-black *:data-slot-[alert=close]:text-white',
      },

      /* Outline */
      {
        variant: 'secondary',
        appearance: 'outline',
        className:
          'border border-border bg-background text-foreground [&_[data-slot=alert-close]]:text-foreground',
      },
      {
        variant: 'primary',
        appearance: 'outline',
        className:
          'border border-border bg-background text-primary [&_[data-slot=alert-close]]:text-foreground',
      },
      {
        variant: 'destructive',
        appearance: 'outline',
        className:
          'border border-border bg-background text-destructive [&_[data-slot=alert-close]]:text-foreground',
      },
      {
        variant: 'success',
        appearance: 'outline',
        className:
          'border border-border bg-background text-[var(--color-success,var(--color-green-500))] [&_[data-slot=alert-close]]:text-foreground',
      },
      {
        variant: 'info',
        appearance: 'outline',
        className:
          'border border-border bg-background text-[var(--color-info,var(--color-violet-600))] [&_[data-slot=alert-close]]:text-foreground',
      },
      {
        variant: 'warning',
        appearance: 'outline',
        className:
          'border border-border bg-background text-[var(--color-warning,var(--color-yellow-500))] [&_[data-slot=alert-close]]:text-foreground',
      },
      {
        variant: 'mono',
        appearance: 'outline',
        className:
          'border border-border bg-background text-foreground [&_[data-slot=alert-close]]:text-foreground',
      },

      /* Light */
      {
        variant: 'secondary',
        appearance: 'light',
        className: 'bg-muted border border-border text-foreground',
      },
      {
        variant: 'primary',
        appearance: 'light',
        className:
          'text-foreground bg-[var(--color-primary-soft,var(--color-blue-50))] border border-[var(--color-primary-alpha,var(--color-blue-100))] [&_[data-slot=alert-icon]]:text-primary dark:bg-[var(--color-primary-soft,var(--color-blue-950))] dark:border-[var(--color-primary-alpha,var(--color-blue-900))]',
      },
      {
        variant: 'destructive',
        appearance: 'light',
        className:
          'items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-500 [&>[data-slot=alert-icon]>svg]:size-4 [&_[data-slot=alert-icon]]:bg-red-500/20 [&_[data-slot=alert-icon]]:rounded-lg [&_[data-slot=alert-icon]]:flex [&_[data-slot=alert-icon]]:size-8 [&_[data-slot=alert-icon]]:shrink-0 [&_[data-slot=alert-icon]]:items-center [&_[data-slot=alert-icon]]:justify-center [&_[data-slot=alert-icon]]:text-red-500 [&_[data-slot=alert-title]]:text-red-500 [&_[data-slot=alert-title]]:font-medium [&_[data-slot=alert-title]]:text-base [&_[data-slot=alert-description]]:text-red-500/70',
      },
      {
        variant: 'success',
        appearance: 'light',
        className:
          'items-start gap-3 bg-green-500/10 border border-green-500/30 text-green-500 [&>[data-slot=alert-icon]>svg]:size-4 [&_[data-slot=alert-icon]]:bg-green-500/20 [&_[data-slot=alert-icon]]:rounded-lg [&_[data-slot=alert-icon]]:flex [&_[data-slot=alert-icon]]:size-8 [&_[data-slot=alert-icon]]:shrink-0 [&_[data-slot=alert-icon]]:items-center [&_[data-slot=alert-icon]]:justify-center [&_[data-slot=alert-icon]]:text-green-500 [&_[data-slot=alert-title]]:text-green-500 [&_[data-slot=alert-title]]:font-medium [&_[data-slot=alert-title]]:text-base [&_[data-slot=alert-description]]:text-green-500/70',
      },
      {
        variant: 'info',
        appearance: 'light',
        className:
          'bg-[var(--color-info-soft,var(--color-violet-50))] border border-[var(--color-info-alpha,var(--color-violet-100))] text-foreground [&_[data-slot=alert-icon]]:text-[var(--color-info-foreground,var(--color-violet-600))] dark:bg-[var(--color-info-soft,var(--color-violet-950))] dark:border-[var(--color-info-alpha,var(--color-violet-900))]',
      },
      {
        variant: 'warning',
        appearance: 'light',
        className:
          'items-start gap-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 [&>[data-slot=alert-icon]>svg]:size-4 [&_[data-slot=alert-icon]]:bg-amber-500/20 [&_[data-slot=alert-icon]]:rounded-lg [&_[data-slot=alert-icon]]:flex [&_[data-slot=alert-icon]]:size-8 [&_[data-slot=alert-icon]]:shrink-0 [&_[data-slot=alert-icon]]:items-center [&_[data-slot=alert-icon]]:justify-center [&_[data-slot=alert-icon]]:text-amber-500 [&_[data-slot=alert-title]]:text-amber-500 [&_[data-slot=alert-title]]:font-medium [&_[data-slot=alert-title]]:text-base [&_[data-slot=alert-description]]:text-amber-500/70',
      },

      /* Mono */
      {
        variant: 'mono',
        icon: 'primary',
        className: '[&_[data-slot=alert-icon]]:text-primary',
      },
      {
        variant: 'mono',
        icon: 'warning',
        className:
          '[&_[data-slot=alert-icon]]:text-[var(--color-warning-foreground,var(--color-yellow-600))]',
      },
      {
        variant: 'mono',
        icon: 'success',
        className:
          '[&_[data-slot=alert-icon]]:text-[var(--color-success-foreground,var(--color-green-600))]',
      },
      {
        variant: 'mono',
        icon: 'destructive',
        className: '[&_[data-slot=alert-icon]]:text-destructive',
      },
      {
        variant: 'mono',
        icon: 'info',
        className:
          '[&_[data-slot=alert-icon]]:text-[var(--color-info-foreground,var(--color-violet-600))]',
      },
    ],
    defaultVariants: {
      variant: 'secondary',
      appearance: 'solid',
      size: 'md',
    },
  },
)

interface AlertProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  close?: boolean
  onClose?: () => void
}

interface AlertIconProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

function Alert({
  className,
  variant,
  size,
  icon,
  appearance,
  close = false,
  onClose,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(
        alertVariants({ variant, size, icon, appearance }),
        className,
      )}
      {...props}
    >
      {children}
      {close && (
        <button
          onClick={onClose}
          aria-label="Dismiss"
          data-slot="alert-close"
          className={cn('group shrink-0 size-4 cursor-pointer')}
        >
          <X className="opacity-60 group-hover:opacity-100 size-4" />
        </button>
      )}
    </div>
  )
}

function AlertTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <div
      data-slot="alert-title"
      className={cn('grow tracking-tight', className)}
      {...props}
    />
  )
}

function AlertIcon({ children, className, ...props }: AlertIconProps) {
  return (
    <div
      data-slot="alert-icon"
      className={cn('shrink-0', className)}
      {...props}
    >
      {children}
    </div>
  )
}

function AlertToolbar({ children, className, ...props }: AlertIconProps) {
  return (
    <div data-slot="alert-toolbar" className={cn(className)} {...props}>
      {children}
    </div>
  )
}

function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      data-slot="alert-description"
      className={cn('text-sm [&_p]:leading-relaxed [&_p]:mb-2', className)}
      {...props}
    />
  )
}

function AlertContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      data-slot="alert-content"
      className={cn(
        'space-y-2 [&_[data-slot=alert-title]]:font-semibold',
        className,
      )}
      {...props}
    />
  )
}

export {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  AlertToolbar,
}
