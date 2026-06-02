'use client'
import React, { ReactNode, Suspense, useState } from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider } from 'next-themes'
import { LanguageProvider } from '@/context/LanguageContext'
import { RegionProvider } from '@/context/RegionContext'
import { providerStyles } from './styles'

export default function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <LanguageProvider>
        <Suspense fallback={null}>
          <RegionProvider>
            <div className={providerStyles.wrapper}>
              <NextUIProvider>
                <QueryClientProvider client={client}>
                  {children}
                </QueryClientProvider>
              </NextUIProvider>
            </div>
          </RegionProvider>
        </Suspense>
      </LanguageProvider>
    </ThemeProvider>
  )
}