import { axiosBase } from '@/api/axiosBase'
import type {
  RdsNoBackupsResponse,
  RdsOpenPortsResponse,
  RdsUnencryptedInstancesResponse,
} from '@/interfaces/aws-api'

export async function fetchRdsOpenPorts(
  region: string,
): Promise<RdsOpenPortsResponse> {
  const { data } = await axiosBase.get<RdsOpenPortsResponse>(
    '/api/v1/rds/open-ports',
    { params: { region } },
  )
  return data
}

export async function fetchRdsUnencryptedInstances(
  region: string,
): Promise<RdsUnencryptedInstancesResponse> {
  const { data } = await axiosBase.get<RdsUnencryptedInstancesResponse>(
    '/api/v1/rds/unencrypted-instances',
    { params: { region } },
  )
  return data
}

export async function fetchRdsNoBackups(
  region: string,
): Promise<RdsNoBackupsResponse> {
  const { data } = await axiosBase.get<RdsNoBackupsResponse>(
    '/api/v1/rds/no-backups',
    { params: { region } },
  )
  return data
}
