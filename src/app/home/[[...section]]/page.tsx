'use client'

import { useParams } from 'next/navigation'
import HomeSectionContent from '@/components/organism/HomeSectionContent'

export default function HomeSectionPage() {
  const params = useParams<{ section?: string[] }>()
  const section = params?.section?.[0]

  return <HomeSectionContent section={section} />
}