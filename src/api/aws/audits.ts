import { axiosBase } from '@/api/axiosBase'
import type {
  ResourcesByProjectTagResponse,
  UntaggedResourcesResponse,
} from '@/interfaces/aws-api'

export async function fetchUntaggedResources(
  region: string,
): Promise<UntaggedResourcesResponse> {
  const { data } = await axiosBase.get<UntaggedResourcesResponse>(
    '/api/v1/audits/untagged-resources',
    { params: { region } },
  )
  return data
}

export async function fetchResourcesByProjectTag(
  region: string,
  projectTagValue: string,
): Promise<ResourcesByProjectTagResponse> {
  const { data } = await axiosBase.get<ResourcesByProjectTagResponse>(
    '/api/v1/audits/resources-by-project',
    { params: { region, projectTagValue } },
  )
  return data
}
