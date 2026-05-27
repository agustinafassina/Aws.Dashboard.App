'use client'
import React, { ReactNode, useState } from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider } from 'next-themes'
import { LanguageProvider } from '@/context/LanguageContext'
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
        <div className={providerStyles.wrapper}>
          <NextUIProvider>
            <QueryClientProvider client={client}>{children}</QueryClientProvider>
          </NextUIProvider>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  )
}