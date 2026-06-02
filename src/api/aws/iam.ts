import { axiosBase } from '@/api/axiosBase'
import type {
  IamAccessKeysResponse,
  IamRiskyPoliciesResponse,
  IamUsersWithoutMfaResponse,
} from '@/interfaces/aws-api'

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

export async function fetchIamUsersWithoutMfa(): Promise<IamUsersWithoutMfaResponse> {
  const { data } = await axiosBase.get<IamUsersWithoutMfaResponse>(
    '/api/v1/iam/users-without-mfa',
  )
  return data
}

export async function fetchIamRiskyPolicies(): Promise<IamRiskyPoliciesResponse> {
  const { data } = await axiosBase.get<IamRiskyPoliciesResponse>(
    '/api/v1/iam/risky-policies',
  )
  return data
}
