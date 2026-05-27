export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
      <div className="h-4 w-3/4 bg-gray_400 rounded mb-4" />
      <div className="space-y-2">
        <div className="h-3 w-full bg-gray_400 rounded" />
        <div className="h-3 w-2/3 bg-gray_400 rounded" />
      </div>
    </div>
  )
}

export const NavBarUserSkeleton = () => {
  return (
    <div className="flex items-center gap-4 animate-pulse">
      <div className="flex flex-col items-end gap-1">
        <div className="h-4 w-32 bg-gray_400 rounded" />
      </div>
      <div className="h-10 w-10 bg-gray_400 rounded-full" />
    </div>
  )
}

export const RadialBarChartSkeleton = ({
  position = 'top-0 right-0',
}: {
  position?: string
}) => {
  return (
    <div className="relative flex items-center justify-center w-[6rem] h-[6rem] ">
      <div
        className={`absolute ${position} w-full h-full  rounded-full border-8 border-gray_400 animate-pulse`}
      />
    </div>
  )
}

export const BarChartSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-[90%] h-[60%] mx-auto">
      <div className="h-[6.25rem] w-full">
        <div className="h-full flex items-end justify-between px-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-[0.9375rem] bg-gray_400 rounded-t animate-pulse"
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
  return <div className="h-4 w-3/4 bg-gray_400 rounded mb-4 animate-pulse" />
}
