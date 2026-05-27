import { axiosBase } from '@/api/axiosBase'
import type {
  InspectorResourceType,
  InspectorVulnerabilitiesResponse,
} from '@/interfaces/aws-api'

export interface InspectorVulnerabilitiesParams {
  region: string
  resourceType: InspectorResourceType
  severity?: string
  status?: string
}

export async function fetchInspectorVulnerabilities(
  params: InspectorVulnerabilitiesParams,
): Promise<InspectorVulnerabilitiesResponse> {
  const { data } = await axiosBase.get<InspectorVulnerabilitiesResponse>(
    '/api/v1/inspector/vulnerabilities',
    {
      params: {
        region: params.region,
        resourceType: params.resourceType,
        ...(params.severity ? { severity: params.severity } : {}),
        ...(params.status ? { status: params.status } : {}),
      },
    },
  )
  return data
}
