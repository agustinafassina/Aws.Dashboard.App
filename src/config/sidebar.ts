import LargeIcon from '@/components/atoms/Icons/LargeIcon'
import BookIcon from '@/components/atoms/Icons/BookIcon'
import UserIcon from '@/components/atoms/Icons/UserIcon'
import ShieldIcon from '@/components/atoms/Icons/ShieldIcon'
import DockerIcon from '@/components/atoms/Icons/DockerIcon'
import ServerIcon from '@/components/atoms/Icons/ServerIcon'
import { ComponentType } from 'react'
import type { SectionKey, SidebarGroupLabelKey, SidebarChildLabelKey } from '@/i18n/types'

type IconComponent = ComponentType<{ width?: number; height?: number; className?: string }>

export interface SidebarLinkEntry {
  kind: 'link'
  sectionKey: SectionKey
  path: string
  icon: IconComponent
  badge?: string | number
  disabled?: boolean
}

export interface SidebarChildLink {
  labelKey: SidebarChildLabelKey
  path: string
  icon: IconComponent
}

export interface SidebarGroupEntry {
  kind: 'group'
  labelKey: SidebarGroupLabelKey
  icon: IconComponent
  children: SidebarChildLink[]
}

export type SidebarEntry = SidebarLinkEntry | SidebarGroupEntry

export interface SidebarConfig {
  [routePrefix: string]: SidebarEntry[]
}

export const sidebarConfig: SidebarConfig = {
  '/home': [
    {
      kind: 'link',
      sectionKey: 'dashboard',
      path: '/home/dashboard',
      icon: LargeIcon,
    },
    {
      kind: 'link',
      sectionKey: 'costs',
      path: '/home/costs',
      icon: BookIcon,
    },
    {
      kind: 'link',
      sectionKey: 'iam',
      path: '/home/iam',
      icon: UserIcon,
    },
    {
      kind: 'group',
      labelKey: 'vulnerabilities',
      icon: ShieldIcon,
      children: [
        {
          labelKey: 'dockerImages',
          path: '/home/vulnerabilities/docker-image',
          icon: DockerIcon,
        },
        {
          labelKey: 'ec2Servers',
          path: '/home/vulnerabilities/ec2-servers',
          icon: ServerIcon,
        },
      ],
    },
  ],
}
