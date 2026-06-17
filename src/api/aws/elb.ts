import { axiosBase } from '@/api/axiosBase'
import type { ElbPublicListenersResponse } from '@/interfaces/aws-api'

export async function fetchElbPublicListeners(
  region: string,
): Promise<ElbPublicListenersResponse> {
  const { data } = await axiosBase.get<ElbPublicListenersResponse>(
    '/api/v1/elb/public-listeners',
    { params: { region } },
  )
  return data
}
