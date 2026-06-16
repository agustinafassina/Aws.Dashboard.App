import { axiosBase } from '@/api/axiosBase'
import type {
  Ec2OpenPortsResponse,
  Ec2UnattachedVolumesResponse,
  Ec2UnusedSecurityGroupsResponse,
} from '@/interfaces/aws-api'

export async function fetchEc2OpenPorts(
  region: string,
): Promise<Ec2OpenPortsResponse> {
  const { data } = await axiosBase.get<Ec2OpenPortsResponse>(
    '/api/v1/ec2/open-ports',
    { params: { region } },
  )
  return data
}

export async function fetchEc2UnusedSecurityGroups(
  region: string,
): Promise<Ec2UnusedSecurityGroupsResponse> {
  const { data } = await axiosBase.get<Ec2UnusedSecurityGroupsResponse>(
    '/api/v1/ec2/unused-security-groups',
    { params: { region } },
  )
  return data
}

export async function fetchEc2UnattachedVolumes(
  region: string,
): Promise<Ec2UnattachedVolumesResponse> {
  const { data } = await axiosBase.get<Ec2UnattachedVolumesResponse>(
    '/api/v1/ec2/unattached-volumes',
    { params: { region } },
  )
  return data
}
