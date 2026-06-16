'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import DashboardSection from '@/components/organism/DashboardSection'
import CostsView from '@/components/organism/CostsView'
import CostsAnalyzeView from '@/components/organism/CostsAnalyzeView'
import IamAccessKeysView from '@/components/organism/IamAccessKeysView'
import IamUsersView from '@/components/organism/IamUsersView'
import VulnerabilitiesView from '@/components/organism/VulnerabilitiesView'
import Ec2ServerDetailContent from '@/components/organism/VulnerabilitiesView/Ec2ServerDetailContent'
import OpenPortsView from '@/components/organism/OpenPortsView'
import S3PublicBucketsView from '@/components/organism/S3PublicBucketsView'
import S3EncryptionStatusView from '@/components/organism/S3EncryptionStatusView'
import LambdaPublicFunctionsView from '@/components/organism/LambdaPublicFunctionsView'
import AcmExpiringCertificatesView from '@/components/organism/AcmExpiringCertificatesView'
import Ec2UnusedSecurityGroupsView from '@/components/organism/Ec2UnusedSecurityGroupsView'
import Ec2UnattachedVolumesView from '@/components/organism/Ec2UnattachedVolumesView'
import UntaggedResourcesView from '@/components/organism/UntaggedResourcesView'
import ResourcesByProjectTagView from '@/components/organism/ResourcesByProjectTagView'
import { getHomePathSegments } from '@/utils/homePath'
import {
  getEc2DetailInstanceId,
  isKnownHomePath,
  resolveHomeView,
  type HomeViewKey,
} from '@/utils/homeRoutes'

const ALL_VIEW_KEYS: HomeViewKey[] = [
  'dashboard',
  'costs',
  'costs-analyze',
  'iam-users',
  'iam-access-keys',
  'vuln-docker',
  'vuln-ec2',
  'vuln-ec2-detail',
  'vuln-rds-ports',
  'vuln-ec2-ports',
  'vuln-s3-public-buckets',
  'security-s3-encryption-status',
  'security-lambda-public-functions',
  'security-acm-expiring-certificates',
  'security-ec2-unused-security-groups',
  'security-ec2-unattached-volumes',
  'audits-untagged-resources',
  'audits-resources-by-project',
]

function HomeViewPanel({
  viewKey,
  segments,
}: {
  viewKey: HomeViewKey
  segments: string[]
}) {
  switch (viewKey) {
    case 'dashboard':
      return <DashboardSection />
    case 'costs':
      return <CostsView />
    case 'costs-analyze':
      return <CostsAnalyzeView />
    case 'iam-users':
      return <IamUsersView />
    case 'iam-access-keys':
      return <IamAccessKeysView />
    case 'vuln-docker':
      return (
        <VulnerabilitiesView
          title="Docker image vulnerabilities"
          description="Amazon Inspector findings grouped by ECR repository."
          resourceType="ecr"
        />
      )
    case 'vuln-ec2':
      return (
        <VulnerabilitiesView
          title="EC2 server vulnerabilities"
          description="Amazon Inspector findings grouped by EC2 instance."
          resourceType="ec2"
        />
      )
    case 'vuln-ec2-detail': {
      const instanceId = getEc2DetailInstanceId(segments)
      if (!instanceId) return null
      return <Ec2ServerDetailContent instanceId={instanceId} />
    }
    case 'vuln-rds-ports':
      return (
        <OpenPortsView
          title="RDS open ports"
          description="RDS instances with security groups and ports exposed to the internet."
          resourceType="rds"
        />
      )
    case 'vuln-ec2-ports':
      return (
        <OpenPortsView
          title="EC2 open ports"
          description="EC2 instances with security groups and inbound ports open to the internet."
          resourceType="ec2"
        />
      )
    case 'vuln-s3-public-buckets':
      return (
        <S3PublicBucketsView
          title="S3 public buckets"
          description="S3 buckets that are publicly accessible via policy, ACL, or missing Block Public Access settings."
        />
      )
    case 'security-s3-encryption-status':
      return (
        <S3EncryptionStatusView
          title="S3 encryption status"
          description="S3 buckets in the selected region that do not have encryption configured."
        />
      )
    case 'security-lambda-public-functions':
      return (
        <LambdaPublicFunctionsView
          title="Lambda public functions"
          description="Lambda functions that are publicly reachable through URL configuration or IAM policy."
        />
      )
    case 'security-acm-expiring-certificates':
      return (
        <AcmExpiringCertificatesView
          title="ACM expiring certificates"
          description="ACM certificates that are expired or will expire soon in the selected region."
        />
      )
    case 'security-ec2-unused-security-groups':
      return (
        <Ec2UnusedSecurityGroupsView
          title="EC2 unused security groups"
          description="Security groups in the selected region not currently attached to active network interfaces."
        />
      )
    case 'security-ec2-unattached-volumes':
      return (
        <Ec2UnattachedVolumesView
          title="EC2 unattached volumes"
          description="EBS volumes in the selected region that are not attached to any running instance."
        />
      )
    case 'audits-untagged-resources':
      return <UntaggedResourcesView />
    case 'audits-resources-by-project':
      return <ResourcesByProjectTagView />
    default:
      return null
  }
}

export default function HomeViewsShell() {
  const pathname = usePathname()
  const router = useRouter()
  const segments = useMemo(() => getHomePathSegments(pathname), [pathname])
  const activeView = resolveHomeView(segments)

  const [mountedViews, setMountedViews] = useState<Set<HomeViewKey>>(() => {
    const initial = resolveHomeView(getHomePathSegments(pathname))
    return initial ? new Set([initial]) : new Set()
  })

  useEffect(() => {
    if (!pathname?.startsWith('/home')) return

    if (segments.length === 0) {
      router.replace('/home/dashboard')
      return
    }

    if (segments.length === 1 && segments[0] === 'iam') {
      router.replace('/home/iam/users')
      return
    }

    if (segments.length === 1 && segments[0] === 'audits') {
      router.replace('/home/audits/untagged-resources')
      return
    }

    if (!isKnownHomePath(segments)) {
      router.replace('/home/dashboard')
      return
    }

    if (!activeView) return

    setMountedViews((prev) => {
      if (prev.has(activeView)) return prev
      const next = new Set(prev)
      next.add(activeView)
      return next
    })
  }, [activeView, pathname, router, segments])

  if (!activeView || !isKnownHomePath(segments)) {
    return null
  }

  return (
    <>
      {ALL_VIEW_KEYS.filter((viewKey) => mountedViews.has(viewKey)).map((viewKey) => (
        <div
          key={viewKey}
          className={viewKey === activeView ? 'contents' : 'hidden'}
          aria-hidden={viewKey !== activeView}
        >
          <HomeViewPanel viewKey={viewKey} segments={segments} />
        </div>
      ))}
    </>
  )
}
