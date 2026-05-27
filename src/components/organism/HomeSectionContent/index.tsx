'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/i18n/useTranslation'
import DashboardSection from '@/components/organism/DashboardSection'
import type { SectionKey } from '@/i18n/types'
import { homeSectionStyles } from './styles'

const VALID_SECTIONS = new Set<SectionKey>(['dashboard', 'costs', 'iam'])

interface HomeSectionContentProps {
  section: string | undefined
}

function SimpleSection({ message }: { message: string }) {
  return (
    <div className={homeSectionStyles.shell}>
      <div className={homeSectionStyles.grid}>{message}</div>
    </div>
  )
}

export default function HomeSectionContent({ section }: HomeSectionContentProps) {
  const router = useRouter()
  const { dictionary } = useTranslation()

  useEffect(() => {
    if (!section) {
      router.replace('/home/dashboard')
      return
    }
    if (!VALID_SECTIONS.has(section as SectionKey)) {
      router.replace('/home/dashboard')
    }
  }, [section, router])

  if (!section || !VALID_SECTIONS.has(section as SectionKey)) {
    return null
  }

  const sectionKey = section as SectionKey

  if (sectionKey === 'dashboard') {
    return <DashboardSection />
  }

  return <SimpleSection message={dictionary.homeContent[sectionKey]} />
}
