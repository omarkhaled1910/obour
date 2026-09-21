import { Map } from 'lucide-react'

type Props = {
  label: string
  className?: string
}

export function MapPlaceholder({ label, className = '' }: Props) {
  return (
    <div
      className={`flex min-h-64 items-center justify-center bg-gradient-to-br from-emerald-50 to-stone-100 text-center ${className}`}
      role="img"
      aria-label={label}
    >
      <div className="space-y-3 px-6 text-stone-500">
        <Map className="mx-auto text-emerald-700" size={42} />
        <p className="font-medium">{label}</p>
        <p className="text-xs">سيتم إضافة الخريطة قريبًا</p>
      </div>
    </div>
  )
}
