import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0/edge'
import { AUTH_COOKIE_OPTIONS, AUTH_TOKEN_COOKIE } from '@/constants/auth'
import { shouldRefreshToken } from '@/utils/jwt'

function isClientNavigationRequest(req: NextRequest) {
  return (
    req.headers.get('RSC') === '1' ||
    req.headers.get('Next-Router-Prefetch') === '1'
  )
}

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  if (
    path.startsWith('/api/auth') ||
    path.startsWith('/_next') ||
    path.includes('icon.png')
  ) {
    return NextResponse.next()
  }

  const existingToken = req.cookies.get(AUTH_TOKEN_COOKIE)?.value

  if (
    existingToken &&
    (isClientNavigationRequest(req) || !shouldRefreshToken(existingToken))
  ) {
    return NextResponse.next()
  }

  const res = NextResponse.next()
  const session = await getSession(req, res)

  if (session?.accessToken) {
    res.cookies.set(AUTH_TOKEN_COOKIE, session.accessToken, {
      ...AUTH_COOKIE_OPTIONS,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    })

    res.cookies.set({
      name: 'username',
      value: session.user.nickname.toLowerCase(),
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
  }

  return res
}

export const config = {
  matcher: ['/', '/home', '/home/:path*', '/guide'],
}
