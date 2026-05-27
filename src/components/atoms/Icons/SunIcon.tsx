import { IIcons } from '@/interfaces/common'

export default function SunIcon({ width = 20, height = 20 }: IIcons) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 3.33333V1.66667M10 18.3333V16.6667M16.6667 10H18.3333M1.66667 10H3.33333M15.7733 4.22667L17.0717 2.92833M2.92833 17.0717L4.22667 15.7733M15.7733 15.7733L17.0717 17.0717M2.92833 2.92833L4.22667 4.22667M14.1667 10C14.1667 12.3012 12.3012 14.1667 10 14.1667C7.69882 14.1667 5.83333 12.3012 5.83333 10C5.83333 7.69882 7.69882 5.83333 10 5.83333C12.3012 5.83333 14.1667 7.69882 14.1667 10Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}