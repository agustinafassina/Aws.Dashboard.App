import { cn } from '@/styles/cn'
import { getRadialPositionClass, skeletonStyles } from './styles'

export const CardSkeleton = () => {
  return (
    <div className={skeletonStyles.card}>
      <div className={skeletonStyles.cardLineLg} />
      <div className={skeletonStyles.cardLines}>
        <div className={cn(skeletonStyles.cardLine, 'w-full')} />
        <div className={cn(skeletonStyles.cardLine, 'w-2/3')} />
      </div>
    </div>
  )
}

export const NavBarUserSkeleton = () => {
  return <div className={skeletonStyles.navBarUser} />
}

export const RadialBarChartSkeleton = ({
  position = 'top-0 right-0',
}: {
  position?: string
}) => {
  return (
    <div className={skeletonStyles.radialWrap}>
      <div
        className={cn(
          skeletonStyles.radialRing,
          getRadialPositionClass(position),
        )}
      />
    </div>
  )
}

export const BarChartSkeleton = () => {
  return (
    <div className={skeletonStyles.barChartWrap}>
      <div className={skeletonStyles.barChartInner}>
        <div className={skeletonStyles.barChartRow}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={skeletonStyles.barColumn}
              style={{
                height: `${Math.random() * 70 + 30}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export const ClientNameSkeleton = () => {
  return <div className={skeletonStyles.clientName} />
}
