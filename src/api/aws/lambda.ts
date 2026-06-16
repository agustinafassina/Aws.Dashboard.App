import { axiosBase } from '@/api/axiosBase'
import type { LambdaPublicFunctionsResponse } from '@/interfaces/aws-api'

export async function fetchLambdaPublicFunctions(
  region: string,
): Promise<LambdaPublicFunctionsResponse> {
  const { data } = await axiosBase.get<LambdaPublicFunctionsResponse>(
    '/api/v1/lambda/public-functions',
    { params: { region } },
  )
  return data
}
