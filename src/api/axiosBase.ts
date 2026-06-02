'use client'

import { ReactNode, useEffect } from 'react'
import axios, { InternalAxiosRequestConfig } from 'axios'
import { useRouter } from 'next/navigation'
import { resolveAuthToken } from '@/utils/authToken'

const axiosBase = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  responseType: 'json',
  withCredentials: false,
})

const axiosBaseJson = axios.create({
  baseURL: '/',
  responseType: 'json',
  withCredentials: false,
})

function redirectToLogin() {
  if (typeof window === 'undefined') return
  const returnTo = encodeURIComponent(
    `${window.location.pathname}${window.location.search}`,
  )
  window.location.href = `/api/auth/login?returnTo=${returnTo}`
}

axiosBase.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await resolveAuthToken()

    if (!token) {
      redirectToLogin()
      return Promise.reject(new Error('No auth token available'))
    }

    config.headers.set('Authorization', `Bearer ${token}`)

    if (!config.headers.has('Content-Type') && config.data !== undefined) {
      config.headers.set('Content-Type', 'application/json')
    }

    return config
  },
  (error) => Promise.reject(error),
)

const cancelSource = axios.CancelToken.source()

const AxiosInterceptor = ({ children }: { children: ReactNode }) => {
  const router = useRouter()

  useEffect(() => {
    void resolveAuthToken()

    const responseInterceptor = axiosBase.interceptors.response.use(
      (response) => response,
      (error: unknown) => {
        const status = (error as { response?: { status?: number } })?.response
          ?.status

        if (status === 401) {
          redirectToLogin()
          return Promise.reject(error)
        }

        return Promise.reject(error)
      },
    )

    return () => {
      axiosBase.interceptors.response.eject(responseInterceptor)
    }
  }, [router])

  return children
}

export { axiosBase, cancelSource, axiosBaseJson, AxiosInterceptor }
