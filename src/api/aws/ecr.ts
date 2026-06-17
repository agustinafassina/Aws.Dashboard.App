import { axiosBase } from '@/api/axiosBase'
import type { EcrRepositoryRisksResponse } from '@/interfaces/aws-api'

export async function fetchEcrRepositoryRisks(
  region: string,
): Promise<EcrRepositoryRisksResponse> {
  const { data } = await axiosBase.get<EcrRepositoryRisksResponse>(
    '/api/v1/ecr/repository-risks',
    { params: { region } },
  )
  return data
}
