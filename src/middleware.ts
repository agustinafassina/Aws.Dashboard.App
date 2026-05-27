import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0/edge'
import { shouldRefreshToken } from '@/utils/jwt'

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  if (
    path.startsWith('/api/auth') ||
    path.startsWith('/_next') ||
    path.includes('icon.png')
  ) {
    return NextResponse.next()
  }

  const existingToken = req.cookies.get('token')?.value

  // Skip Auth0 session round-trip when the access token is still valid.
  if (!shouldRefreshToken(existingToken)) {
    return NextResponse.next()
  }

  const res = NextResponse.next()
  const session = await getSession(req, res)

  if (session?.accessToken) {
    res.cookies.set('token', session.accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
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
  matcher: ['/((?!api/auth|_next/static|_next/image|icon.png).*)'],
}
