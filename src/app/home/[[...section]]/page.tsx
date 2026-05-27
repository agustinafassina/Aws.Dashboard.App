'use client'

import { useParams } from 'next/navigation'
import HomeSectionContent from '@/components/organism/HomeSectionContent'

export default function HomeSectionPage() {
  const params = useParams<{ section?: string[] }>()
  const segments = params?.section ?? []

  return <HomeSectionContent segments={segments} />
}
