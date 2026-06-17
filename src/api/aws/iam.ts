import { axiosBase } from '@/api/axiosBase'
import type {
  IamAccessKeysResponse,
  IamAdminPrivilegeGrantsResponse,
  IamCrossAccountRolesResponse,
  IamInlinePoliciesResponse,
  IamOverprivilegedPoliciesResponse,
  IamRiskyPoliciesResponse,
  IamRootAccountStatusResponse,
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

export async function fetchIamOverprivilegedCustomPolicies(): Promise<IamOverprivilegedPoliciesResponse> {
  const { data } = await axiosBase.get<IamOverprivilegedPoliciesResponse>(
    '/api/v1/iam/overprivileged-custom-policies',
  )
  return data
}

export async function fetchIamAdminPrivilegeGrants(): Promise<IamAdminPrivilegeGrantsResponse> {
  const { data } = await axiosBase.get<IamAdminPrivilegeGrantsResponse>(
    '/api/v1/iam/admin-privilege-grants',
  )
  return data
}

export async function fetchIamCrossAccountRoles(): Promise<IamCrossAccountRolesResponse> {
  const { data } = await axiosBase.get<IamCrossAccountRolesResponse>(
    '/api/v1/iam/cross-account-roles',
  )
  return data
}

export async function fetchIamRootAccountStatus(): Promise<IamRootAccountStatusResponse> {
  const { data } = await axiosBase.get<IamRootAccountStatusResponse>(
    '/api/v1/iam/root-account-status',
  )
  return data
}

export async function fetchIamInlinePolicies(): Promise<IamInlinePoliciesResponse> {
  const { data } = await axiosBase.get<IamInlinePoliciesResponse>(
    '/api/v1/iam/inline-policies',
  )
  return data
}
