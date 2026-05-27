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
    default:
      return null
  }
}
