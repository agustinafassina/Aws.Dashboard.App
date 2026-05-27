import React from 'react'
import { Montserrat } from 'next/font/google'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import NavBar from '@/components/organism/NavBar'
import Providers from '@/provider'
import '@/styles/globals.css'
import { AxiosInterceptor } from '@/api/axiosBase'

export const metadata = {
  title: 'Template Agus App'
}

const montserrat = Montserrat({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray_900 text-gray_800 dark:text-gray_100 m-0 p-0 ${montserrat.className}`}
      suppressHydrationWarning
    >
      <AxiosInterceptor>
        <UserProvider>
          <body
            className="bg-white dark:bg-gray_900 text-gray_800 dark:text-gray_100 m-0 p-0 transition-colors"
            suppressHydrationWarning
          >
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
