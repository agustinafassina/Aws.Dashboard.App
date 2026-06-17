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
import ProjectsIcon from '@/components/atoms/Icons/ProjectsIcon'
import SpendIcon from '@/components/atoms/Icons/SpendIcon'
import PolicyClockIcon from '@/components/atoms/Icons/PolicyClockIcon'
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
      kind: 'group',
      labelKey: 'costs',
      icon: BookIcon,
      children: [
        {
          labelKey: 'costsOverview',
          path: '/home/costs',
          icon: BookIcon,
        },
        {
          labelKey: 'costsAnalyze',
          path: '/home/costs/analyze',
          icon: SpendIcon,
        },
      ],
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
      labelKey: 'runtimeSecurity',
      icon: ShieldIcon,
      children: [
        {
          labelKey: 'acmExpiringCertificates',
          path: '/home/security/acm-expiring-certificates',
          icon: PolicyClockIcon,
        },
        {
          labelKey: 'lambdaPublicFunctions',
          path: '/home/security/lambda-public-functions',
          icon: ServerIcon,
        },
        {
          labelKey: 'ec2OpenPorts',
          path: '/home/security/ec2-open-ports',
          icon: ServerIcon,
        },
        {
          labelKey: 'elbPublicListeners',
          path: '/home/security/elb-public-listeners',
          icon: ServerIcon,
        },
        {
          labelKey: 'rdsOpenPorts',
          path: '/home/security/rds-open-ports',
          icon: DatabaseIcon,
        },
        {
          labelKey: 'ec2Servers',
          path: '/home/vulnerabilities/ec2-servers',
          icon: ServerIcon,
        },
        {
          labelKey: 'dockerImages',
          path: '/home/vulnerabilities/docker-image',
          icon: DockerIcon,
        },
      ],
    },
    {
      kind: 'group',
      labelKey: 'dataSecurity',
      icon: BucketIcon,
      children: [
        {
          labelKey: 's3PublicBuckets',
          path: '/home/security/s3-public-buckets',
          icon: BucketIcon,
        },
        {
          labelKey: 's3EncryptionStatus',
          path: '/home/security/s3-encryption-status',
          icon: BucketIcon,
        },
        {
          labelKey: 'rdsUnencryptedInstances',
          path: '/home/security/rds-unencrypted-instances',
          icon: DatabaseIcon,
        },
        {
          labelKey: 'rdsNoBackups',
          path: '/home/security/rds-no-backups',
          icon: DatabaseIcon,
        },
        {
          labelKey: 'ecrRepositoryRisks',
          path: '/home/security/ecr-repository-risks',
          icon: DockerIcon,
        },
        {
          labelKey: 'resourcesByProject',
          path: '/home/audits/resources-by-project',
          icon: ProjectsIcon,
        },
        {
          labelKey: 'untaggedResources',
          path: '/home/audits/untagged-resources',
          icon: ProjectsIcon,
        },
      ],
    },
    {
      kind: 'group',
      labelKey: 'governance',
      icon: SecurityIcon,
      children: [
        {
          labelKey: 'ec2UnattachedVolumes',
          path: '/home/security/ec2-unattached-volumes',
          icon: DatabaseIcon,
        },
        {
          labelKey: 'ec2UnusedSecurityGroups',
          path: '/home/security/ec2-unused-security-groups',
          icon: ServerIcon,
        },
        {
          labelKey: 'ec2Imdsv1Instances',
          path: '/home/security/ec2-imdsv1-instances',
          icon: ServerIcon,
        },
      ],
    },
  ],
}
