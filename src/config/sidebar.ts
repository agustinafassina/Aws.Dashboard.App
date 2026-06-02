import LargeIcon from '@/components/atoms/Icons/LargeIcon'
import BookIcon from '@/components/atoms/Icons/BookIcon'
import AccessKeyIcon from '@/components/atoms/Icons/AccessKeyIcon'
import UserIcon from '@/components/atoms/Icons/UserIcon'
import UsersIcon from '@/components/atoms/Icons/UsersIcon'
import ShieldIcon from '@/components/atoms/Icons/ShieldIcon'
import SecurityIcon from '@/components/atoms/Icons/SecurityIcon'
import DockerIcon from '@/components/atoms/Icons/DockerIcon'
import ServerIcon from '@/components/atoms/Icons/ServerIcon'
import DatabaseIcon from '@/components/atoms/Icons/DatabaseIcon'
import BucketIcon from '@/components/atoms/Icons/BucketIcon'
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
      kind: 'group',
      labelKey: 'iam',
      icon: UserIcon,
      children: [
        {
          labelKey: 'iamUsers',
          path: '/home/iam/users',
          icon: UsersIcon,
        },
        {
          labelKey: 'iamAccessKeys',
          path: '/home/iam/access-keys',
          icon: AccessKeyIcon,
        },
      ],
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
    {
      kind: 'group',
      labelKey: 'security',
      icon: SecurityIcon,
      children: [
        {
          labelKey: 'rdsOpenPorts',
          path: '/home/security/rds-open-ports',
          icon: DatabaseIcon,
        },
        {
          labelKey: 'ec2OpenPorts',
          path: '/home/security/ec2-open-ports',
          icon: ServerIcon,
        },
        {
          labelKey: 's3PublicBuckets',
          path: '/home/security/s3-public-buckets',
          icon: BucketIcon,
        },
      ],
    },
  ],
}
