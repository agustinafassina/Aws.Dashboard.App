import MetaTag from '@/components/atoms/MetaTag'

interface LastScanTagProps {
  label: string
  value: string
  className?: string
}

export default function LastScanTag({ label, value, className }: LastScanTagProps) {
  return (
    <MetaTag
      label={label}
      value={value}
      className={className}
      valueClassName="font-mono"
    />
  )
}
