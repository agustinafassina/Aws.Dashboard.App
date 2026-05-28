import { axiosBase } from '@/api/axiosBase'
import type { IamAccessKeysResponse } from '@/interfaces/aws-api'

const ACCESS_KEY_VISIBLE_SUFFIX_LENGTH = 4

export function maskAccessKeyId(
  accessKeyId: string,
  suffixLength = ACCESS_KEY_VISIBLE_SUFFIX_LENGTH,
): string {
  if (!accessKeyId) return '—'
  if (accessKeyId.length <= suffixLength) return accessKeyId

  return `••••${accessKeyId.slice(-suffixLength)}`
}

export async function fetchIamAccessKeys(): Promise<IamAccessKeysResponse> {
  const { data } = await axiosBase.get<IamAccessKeysResponse>(
    '/api/v1/iam/access-keys',
  )
  return data
}
