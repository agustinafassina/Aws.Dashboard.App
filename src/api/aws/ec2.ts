import { axiosBase } from '@/api/axiosBase'
import type { Ec2OpenPortsResponse } from '@/interfaces/aws-api'

export async function fetchEc2OpenPorts(
  region: string,
): Promise<Ec2OpenPortsResponse> {
  const { data } = await axiosBase.get<Ec2OpenPortsResponse>(
    '/api/v1/ec2/open-ports',
    { params: { region } },
  )
  return data
}
