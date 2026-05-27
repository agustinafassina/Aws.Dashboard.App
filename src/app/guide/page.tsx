import type { Metadata } from 'next'
import GuidePageContent from '@/components/organism/GuidePageContent'
import { appConfig } from '@/config/app'
import { getDictionary } from '@/i18n/getDictionary'
import { getServerLocale } from '@/utils/locale'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale()
  const guide = getDictionary(locale).guide

  return {
    title: guide.metaTitle,
    description: guide.description,
    openGraph: {
      title: guide.metaTitle,
      description: guide.description,
      siteName: appConfig.name,
    },
  }
}

export default function GuidePage() {
  return <GuidePageContent />
}
