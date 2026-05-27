import LargeIcon from '@/components/atoms/Icons/LargeIcon'
import BookIcon from '@/components/atoms/Icons/BookIcon'
import UserIcon from '@/components/atoms/Icons/UserIcon'
import { ComponentType } from 'react'
import type { SectionKey } from '@/i18n/types'

export interface SidebarItem {
  sectionKey: SectionKey
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
      sectionKey: 'dashboard',
      path: '/home/dashboard',
      icon: LargeIcon,
    },
    {
      sectionKey: 'costs',
      path: '/home/costs',
      icon: BookIcon,
    },
    {
      sectionKey: 'iam',
      path: '/home/iam',
      icon: UserIcon,
    },
  ],
}