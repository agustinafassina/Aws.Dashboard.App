'use client'
import { ReactNode, useEffect } from 'react'
import axios, { InternalAxiosRequestConfig } from 'axios'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'

const axiosBase = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  responseType: 'json',
  withCredentials: true,
})

const axiosBaseJson = axios.create({
  baseURL: '/',
  responseType: 'json',
  withCredentials: true,
})

axiosBase.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getCookie('token')

    if (!token) {
      throw new Error('No token available')
    }

    config.headers.set('Content-Type', 'application/json')
    config.headers.set('Access-Control-Allow-Origin', '*')
    config.headers.set('Authorization', `Bearer ${token}`)

    return config
  },
  (error) => Promise.reject(error),
)

const cancelSource = axios.CancelToken.source()

const AxiosInterceptor = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  useEffect(() => {
    const responseInterceptor = axiosBase.interceptors.response.use(
      (response) => response,
      (error: any) => {
        if (error?.response?.status === 401) {
          router.push('/api/auth/logout')
          return
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
