import { axiosBase } from '@/api/axiosBase'
import type { IamAccessKeysResponse } from '@/interfaces/aws-api'

export async function fetchIamAccessKeys(): Promise<IamAccessKeysResponse> {
  const { data } = await axiosBase.get<IamAccessKeysResponse>(
    '/api/v1/iam/access-keys',
  )
  return data
}
