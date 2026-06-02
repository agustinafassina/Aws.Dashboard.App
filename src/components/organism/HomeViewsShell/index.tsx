'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import DashboardSection from '@/components/organism/DashboardSection'
import CostsView from '@/components/organism/CostsView'
import IamAccessKeysView from '@/components/organism/IamAccessKeysView'
import IamUsersView from '@/components/organism/IamUsersView'
import VulnerabilitiesView from '@/components/organism/VulnerabilitiesView'
import OpenPortsView from '@/components/organism/OpenPortsView'
import S3PublicBucketsView from '@/components/organism/S3PublicBucketsView'
import { getHomePathSegments } from '@/utils/homePath'
import {
  isKnownHomePath,
  resolveHomeView,
  type HomeViewKey,
} from '@/utils/homeRoutes'

const ALL_VIEW_KEYS: HomeViewKey[] = [
  'dashboard',
  'costs',
  'iam-users',
  'iam-access-keys',
  'vuln-docker',
  'vuln-ec2',
  'vuln-rds-ports',
  'vuln-ec2-ports',
  'vuln-s3-public-buckets',
]

function HomeViewPanel({ viewKey }: { viewKey: HomeViewKey }) {
  switch (viewKey) {
    case 'dashboard':
      return <DashboardSection />
    case 'costs':
      return <CostsView />
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
          description="Amazon Inspector findings for EC2 instances."
          resourceType="ec2"
        />
      )
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
          <HomeViewPanel viewKey={viewKey} />
        </div>
      ))}
    </>
  )
}
