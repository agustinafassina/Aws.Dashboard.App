'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchIamAdminPrivilegeGrants } from '@/api/aws/iam'

export function useIamAdminPrivilegeGrants() {
  return useQuery({
    queryKey: ['iam', 'admin-privilege-grants'],
    queryFn: fetchIamAdminPrivilegeGrants,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
