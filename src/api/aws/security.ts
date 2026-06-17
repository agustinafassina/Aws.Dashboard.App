import { axiosBase } from '@/api/axiosBase'
import type { SecuritySummaryResponse } from '@/interfaces/aws-api'

export async function fetchSecuritySummary(
  region: string,
): Promise<SecuritySummaryResponse> {
  const { data } = await axiosBase.get<SecuritySummaryResponse>(
    '/api/v1/security/summary',
    { params: { region } },
  )
  return data
}
