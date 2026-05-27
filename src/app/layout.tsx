import React from 'react'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import NavBar from '@/components/organism/NavBar'
import Providers from '@/provider'
import '@/styles/globals.css'
import { AxiosInterceptor } from '@/api/axiosBase'
import { appConfig } from '@/config/app'
import { cn } from '@/styles/cn'
import { getServerLocale } from '@/utils/locale'
import { rootLayoutStyles } from './styles'

export const metadata: Metadata = {
  title: {
    default: appConfig.name,
    template: `%s | ${appConfig.name}`,
  },
  description: appConfig.description,
  openGraph: {
    title: appConfig.name,
    description: appConfig.description,
    type: 'website',
  },
}

const montserrat = Montserrat({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getServerLocale()

  return (
    <html
      lang={locale}
      className={cn(rootLayoutStyles.html, montserrat.className)}
      suppressHydrationWarning
    >
      <AxiosInterceptor>
        <UserProvider>
          <body className={rootLayoutStyles.body} suppressHydrationWarning>
            <Providers>
              <NavBar />
              {children}
            </Providers>
          </body>
        </UserProvider>
      </AxiosInterceptor>
    </html>
  )
}
