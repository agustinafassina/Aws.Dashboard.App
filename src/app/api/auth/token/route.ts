import { getSession } from '@auth0/nextjs-auth0'
import { NextResponse } from 'next/server'
import { AUTH_COOKIE_OPTIONS, AUTH_TOKEN_COOKIE } from '@/constants/auth'

export async function GET() {
  const session = await getSession()

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const response = NextResponse.json({ accessToken: session.accessToken })

  response.cookies.set(AUTH_TOKEN_COOKIE, session.accessToken, {
    ...AUTH_COOKIE_OPTIONS,
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
  })

  return response
}
