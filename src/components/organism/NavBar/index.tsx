'use client'

import { useEffect, useMemo, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { getAuthToken } from '@/utils/authToken'
import { jwtDecode } from 'jwt-decode'
import Image from 'next/image'
import Link from 'next/link'
import RegionSelector from '@/components/molecules/RegionSelector'
import UserMenu from '@/components/molecules/UserMenu'
import { NavBarUserSkeleton } from '@/components/atoms/Skeleton'
import { CustomJwtPayload } from '@/interfaces/payload-jwt'
import { useTranslation } from '@/i18n/useTranslation'
import { getHomePathSegments } from '@/utils/homePath'
import { getEc2DetailInstanceId } from '@/utils/homeRoutes'
import { getCurrentNavTitle } from '@/utils/getCurrentNavTitle'
import {
  getLogoSkeletonClass,
  getNavBarClass,
  getSectionTitleClass,
  getTitleSkeletonClass,
  navBarStyles,
} from './styles'

export default function NavBar() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const segments = useMemo(() => getHomePathSegments(pathname), [pathname])
  const ec2DetailInstanceId = getEc2DetailInstanceId(segments)
  const navTitle = getCurrentNavTitle(pathname)
  const { dictionary, sectionTitle, sidebarItemLabel } = useTranslation()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const token = getAuthToken()
  const [accessTokenDecoded, setAccessTokenDecoded] =
    useState<CustomJwtPayload | null>(null)

  const isDark = mounted && resolvedTheme === 'dark'
  const currentPageTitle = ec2DetailInstanceId
    ? ec2DetailInstanceId
    : navTitle
      ? navTitle.type === 'section'
        ? sectionTitle(navTitle.key)
        : sidebarItemLabel(navTitle.key)
      : null

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/api/auth/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (token && typeof token === 'string') {
      try {
        const decoded = jwtDecode(token) as CustomJwtPayload
        setAccessTokenDecoded(decoded)
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }
  }, [token])

  const navClassName = getNavBarClass(isDark)

  if (isLoading) {
    return (
      <nav className={navClassName}>
        <div className={navBarStyles.loadingLeft}>
          <div className={getLogoSkeletonClass(isDark)} />
          {currentPageTitle ? (
            <>
              <span className={navBarStyles.titleDivider} aria-hidden />
              <span className={getSectionTitleClass(isDark)}>
                {currentPageTitle}
              </span>
            </>
          ) : (
            <div className={getTitleSkeletonClass(isDark)} />
          )}
        </div>
        <NavBarUserSkeleton />
      </nav>
    )
  }

  return (
    <nav
      className={navClassName}
      role="navigation"
      aria-label={dictionary.nav.mainAriaLabel}
    >
      <div className={navBarStyles.leftCluster}>
        <Link
          href="/home/dashboard"
          className={navBarStyles.logoLink}
          aria-label={dictionary.nav.goToDashboard}
        >
          <Image
            src="/images/security-logo.png"
            alt=""
            width={48}
            height={48}
            className={navBarStyles.logoImage}
            priority
          />
        </Link>
        {currentPageTitle ? (
          <>
            <span className={navBarStyles.titleDivider} aria-hidden />
            <span
              className={getSectionTitleClass(isDark)}
              aria-current="page"
            >
              {currentPageTitle}
            </span>
          </>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <RegionSelector />
        {user && Object.keys(user).length > 0 ? (
          <UserMenu
            user={user}
            jobTitle={accessTokenDecoded?.user_jobtitle_ad}
          />
        ) : (
          <NavBarUserSkeleton />
        )}
      </div>
    </nav>
  )
}
