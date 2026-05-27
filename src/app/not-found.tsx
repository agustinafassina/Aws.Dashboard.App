import ErrorPageView from '@/components/organism/ErrorPageView'
import { getDictionary } from '@/i18n/getDictionary'
import { getServerLocale } from '@/utils/locale'

export default async function NotFound() {
  const locale = await getServerLocale()
  const { notFound } = getDictionary(locale).errors

  return (
    <ErrorPageView
      title={notFound.title}
      description={notFound.description}
      code="404"
      primaryAction={{
        label: notFound.backHome,
        href: '/home/dashboard',
      }}
    />
  )
}
