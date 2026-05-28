import { axiosBase } from '@/api/axiosBase'
import type { S3PublicBucketsResponse } from '@/interfaces/aws-api'

export async function fetchS3PublicBuckets(
  region: string,
): Promise<S3PublicBucketsResponse> {
  const { data } = await axiosBase.get<S3PublicBucketsResponse>(
    '/api/v1/s3/public-buckets',
    { params: { region } },
  )
  return data
}
