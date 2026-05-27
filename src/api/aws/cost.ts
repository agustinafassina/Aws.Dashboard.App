import { axiosBase } from '@/api/axiosBase'
import type { CostByProjectResponse } from '@/interfaces/aws-api'

export async function fetchCostsByProject(
  startDate: string,
  endDate: string,
): Promise<CostByProjectResponse> {
  const { data } = await axiosBase.get<CostByProjectResponse>(
    '/api/v1/cost/by-project',
    { params: { startDate, endDate } },
  )
  return data
}
