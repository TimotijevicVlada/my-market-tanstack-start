interface InfoRowProps {
  icon?: React.ReactNode
  label: string
  value: string | null | undefined
  placeholder?: string
}

export const InfoRow = ({
  icon,
  label,
  value,
  placeholder = 'Nije uneto',
}: InfoRowProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <div className="flex items-center gap-2.5 text-foreground">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <span
          className={
            !value
              ? 'text-muted-foreground italic'
              : 'line-clamp-4 whitespace-pre-line'
          }
        >
          {value || placeholder}
        </span>
      </div>
    </div>
  )
}
