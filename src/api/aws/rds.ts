import { axiosBase } from '@/api/axiosBase'
import type { RdsOpenPortsResponse } from '@/interfaces/aws-api'

export async function fetchRdsOpenPorts(
  region: string,
): Promise<RdsOpenPortsResponse> {
  const { data } = await axiosBase.get<RdsOpenPortsResponse>(
    '/api/v1/rds/open-ports',
    { params: { region } },
  )
  return data
}
