'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation'
import { getCookie } from 'cookies-next'
import { jwtDecode } from 'jwt-decode'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/atoms/Button'
import AppLogoIcon from '@/components/atoms/Icons/AppLogoIcon'
import LogoutIcon from '@/components/atoms/Icons/Logout'
import ThemeToggle from '@/components/atoms/ThemeToggle'
import { NavBarUserSkeleton } from '@/components/atoms/Skeleton'
import { getClientName } from '@/utils/sharedFunctions'
import { CustomJwtPayload } from '@/interfaces/payload-jwt'

export default function NavBar() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const token = getCookie('token')
  const [accessTokenDecoded, setAccessTokenDecoded] =
    useState<CustomJwtPayload | null>(null)
  const [imageError, setImageError] = useState(false)

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

  const handleLogout = () => {
    router.push('/api/auth/logout')
  }

  if (isLoading) {
    return (
      <nav className="flex items-center justify-between bg-green_500 dark:bg-green_600 border-b-[0.0625rem] border-b-gray_160 dark:border-b-gray_700 text-white p-3 w-full h-[4.75rem]">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-white/20 rounded-lg animate-pulse mr-4" />
        </div>
        <NavBarUserSkeleton />
      </nav>
    )
  }

  return (
    <nav 
      className="flex items-center justify-between bg-green_500 dark:bg-green_600 border-b-[0.0625rem] border-b-gray_160 dark:border-b-gray_700 text-white p-3 w-full h-[4.75rem] sticky top-0 z-50 transition-colors"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center">
        <Link
          href="/home/dashboard"
          className="flex items-center mr-4 hover:opacity-90 transition-opacity"
          aria-label="Go to dashboard"
        >
          <span className="flex items-center justify-center w-14 h-14 rounded-lg bg-white/15 text-white ring-1 ring-white/20">
            <AppLogoIcon />
          </span>
        </Link>
      </div>
      
      {user && Object.keys(user).length > 0 ? (
        <div className="flex items-center gap-3 md:gap-4">
          <ThemeToggle />
          
          <div className="hidden sm:flex flex-col items-end text-sm">
            <span className="font-medium">{getClientName(user)}</span>
            {accessTokenDecoded?.user_jobtitle_ad && (
              <span className="text-gray_800 dark:text-gray_200 text-xs">
                {accessTokenDecoded.user_jobtitle_ad}
              </span>
            )}
          </div>
          
          {user.picture && !imageError ? (
            <Image
              src={user.picture}
              alt={`${getClientName(user)} avatar`}
              width={40}
              height={40}
              className="rounded-full border-2 border-white/20 hover:border-white/40 transition-colors"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium">
              {getClientName(user)
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </div>
          )}
          
          <Button 
            className="hover:opacity-80 transition-opacity" 
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogoutIcon width={20} height={20} />
          </Button>
        </div>
      ) : (
        <NavBarUserSkeleton />
      )}
    </nav>
  )
}