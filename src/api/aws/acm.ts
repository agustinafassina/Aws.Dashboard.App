import { axiosBase } from '@/api/axiosBase'
import type { AcmExpiringCertificatesResponse } from '@/interfaces/aws-api'

export async function fetchAcmExpiringCertificates(
  region: string,
  days = 30,
): Promise<AcmExpiringCertificatesResponse> {
  const { data } = await axiosBase.get<AcmExpiringCertificatesResponse>(
    '/api/v1/acm/expiring-certificates',
    { params: { region, days } },
  )
  return data
}
