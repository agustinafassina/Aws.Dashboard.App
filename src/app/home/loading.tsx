import { CardSkeleton } from '@/components/atoms/Skeleton'

export default function HomeLoading() {
  return (
    <div
      className="h-[calc(90vh-10rem)] p-4 min-w-[70rem] max-w-[90rem] mx-auto"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="h-8 w-48 bg-gray_200 dark:bg-gray_700 rounded mb-6 animate-pulse" />
      <div className="grid grid-cols-5 gap-4 h-[30rem]">
        {Array.from({ length: 5 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
