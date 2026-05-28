'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardSection from '@/components/organism/DashboardSection'
import HomeLoading from '@/app/home/loading'
import { isKnownHomePath, resolveHomeView } from '@/utils/homeRoutes'

const CostsView = dynamic(
  () => import('@/components/organism/CostsView'),
  { loading: () => <HomeLoading /> },
)

const IamAccessKeysView = dynamic(
  () => import('@/components/organism/IamAccessKeysView'),
  { loading: () => <HomeLoading /> },
)

const VulnerabilitiesView = dynamic(
  () => import('@/components/organism/VulnerabilitiesView'),
  { loading: () => <HomeLoading /> },
)

const OpenPortsView = dynamic(
  () => import('@/components/organism/OpenPortsView'),
  { loading: () => <HomeLoading /> },
)

const S3PublicBucketsView = dynamic(
  () => import('@/components/organism/S3PublicBucketsView'),
  { loading: () => <HomeLoading /> },
)

interface HomeSectionContentProps {
  segments: string[]
}

export default function HomeSectionContent({ segments }: HomeSectionContentProps) {
  const router = useRouter()
  const view = resolveHomeView(segments)

  useEffect(() => {
    if (segments.length === 0) {
      router.replace('/home/dashboard')
      return
    }
    if (!isKnownHomePath(segments)) {
      router.replace('/home/dashboard')
    }
  }, [segments, router])

  if (!view || !isKnownHomePath(segments)) {
    return null
  }

  switch (view) {
    case 'dashboard':
      return <DashboardSection />
    case 'costs':
      return <CostsView />
    case 'iam':
      return <IamAccessKeysView />
    case 'vuln-docker':
      return (
        <VulnerabilitiesView
          title="Docker image vulnerabilities"
          description="Amazon Inspector findings for container images in ECR."
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
