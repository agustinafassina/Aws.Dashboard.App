import LargeIcon from '@/components/atoms/Icons/LargeIcon'
import BookIcon from '@/components/atoms/Icons/BookIcon'
import UserIcon from '@/components/atoms/Icons/UserIcon'
import { ReactNode, ComponentType } from 'react'

export interface SidebarItem {
  name: string
  path: string
  icon: ComponentType<{ width?: number; height?: number }>
  badge?: string | number
  disabled?: boolean
}

export interface SidebarConfig {
  [routePrefix: string]: SidebarItem[]
}

export const sidebarConfig: SidebarConfig = {
  '/home': [
    {
      name: 'Dashboard',
      path: '/home/dashboard',
      icon: LargeIcon,
    },
    {
      name: 'Costs',
      path: '/home/costs',
      icon: BookIcon,
    },
    {
      name: 'Iam users',
      path: '/home/iam',
      icon: UserIcon,
    },
  ],
}