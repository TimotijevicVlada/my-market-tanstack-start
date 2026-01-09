import type { TabsContextType } from '@/components/ui/tabs'
import { TabsList, TabsTrigger, Tabs as TabsUI } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface Tab<T extends string> {
  label: string
  value: T
  icon?: React.ReactNode
}

interface TabsProps<T extends string> {
  defaultValue: T
  value: T
  tabs: Array<Tab<T>>
  onTabChange: (tab: Tab<T>) => void
  variant?: TabsContextType['variant']
  size?: TabsContextType['size']
  className?: string
}

export const Tabs = <T extends string>({
  defaultValue,
  value,
  tabs,
  variant = 'default',
  size = 'md',
  className,
  onTabChange,
}: TabsProps<T>) => {
  return (
    <TabsUI
      defaultValue={defaultValue}
      value={value}
      className={cn('text-sm text-muted-foreground', className)}
    >
      <TabsList variant={variant} size={size}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            onClick={() => onTabChange(tab)}
          >
            {tab.icon} {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </TabsUI>
  )
}
