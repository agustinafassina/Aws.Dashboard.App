'use client'

import { useMemo } from 'react'
import { useIamAccessKeys } from '@/hooks/useIamAccessKeys'
import { useIamUsersWithoutMfa } from '@/hooks/useIamUsersWithoutMfa'
import { useInspectorVulnerabilities } from '@/hooks/useInspectorVulnerabilities'
import { useEc2OpenPorts } from '@/hooks/useEc2OpenPorts'
import { useRdsOpenPorts } from '@/hooks/useRdsOpenPorts'
import { useS3PublicBuckets } from '@/hooks/useS3PublicBuckets'
import { useS3EncryptionStatus } from '@/hooks/useS3EncryptionStatus'
import { useLambdaPublicFunctions } from '@/hooks/useLambdaPublicFunctions'
import { useAcmExpiringCertificates } from '@/hooks/useAcmExpiringCertificates'
import { useEc2UnusedSecurityGroups } from '@/hooks/useEc2UnusedSecurityGroups'
import { useEc2UnattachedVolumes } from '@/hooks/useEc2UnattachedVolumes'
import { useUntaggedResources } from '@/hooks/useUntaggedResources'
import { useAwsRegion } from '@/context/RegionContext'
import { formatSidebarBadge } from '@/utils/formatSidebarBadge'
import type {
  SectionKey,
  SidebarChildLabelKey,
  SidebarGroupLabelKey,
} from '@/i18n/types'

export type SidebarCountableKey = SidebarChildLabelKey | SidebarGroupLabelKey

export function useSidebarBadges() {
  const { region } = useAwsRegion()

  const iamKeysQuery = useIamAccessKeys()
  const iamUsersQuery = useIamUsersWithoutMfa()
  const inspectorEcrQuery = useInspectorVulnerabilities({
    region,
    resourceType: 'ecr',
  })
  const inspectorEc2Query = useInspectorVulnerabilities({
    region,
    resourceType: 'ec2',
  })
  const ec2PortsQuery = useEc2OpenPorts(region)
  const rdsPortsQuery = useRdsOpenPorts(region)
  const s3Query = useS3PublicBuckets(region)
  const s3EncryptionQuery = useS3EncryptionStatus(region)
  const lambdaQuery = useLambdaPublicFunctions(region)
  const acmQuery = useAcmExpiringCertificates(region)
  const ec2UnusedSecurityGroupsQuery = useEc2UnusedSecurityGroups(region)
  const ec2UnattachedVolumesQuery = useEc2UnattachedVolumes(region)
  const untaggedQuery = useUntaggedResources(region)

  const counts = useMemo<Record<SidebarCountableKey, number>>(
    () => ({
      iam:
        (iamUsersQuery.data?.usersWithoutMfa ?? 0) +
        (iamKeysQuery.data?.accessKeysNeedingRotation ?? 0) +
        (iamKeysQuery.data?.accessKeysNeverUsed ?? 0),
      costs: 0,
      costsOverview: 0,
      costsAnalyze: 0,
      iamUsers: iamUsersQuery.data?.usersWithoutMfa ?? 0,
      iamAccessKeys:
        (iamKeysQuery.data?.accessKeysNeedingRotation ?? 0) +
        (iamKeysQuery.data?.accessKeysNeverUsed ?? 0),
      dockerImages: inspectorEcrQuery.data?.totalFindings ?? 0,
      ec2Servers: inspectorEc2Query.data?.totalFindings ?? 0,
      rdsOpenPorts: rdsPortsQuery.data?.instancesWithPublicPorts ?? 0,
      ec2OpenPorts: ec2PortsQuery.data?.instancesWithPublicPorts ?? 0,
      s3PublicBuckets: s3Query.data?.publicBucketsCount ?? 0,
      s3EncryptionStatus: s3EncryptionQuery.data?.unencryptedBucketsCount ?? 0,
      lambdaPublicFunctions: lambdaQuery.data?.publicFunctionsCount ?? 0,
      acmExpiringCertificates: acmQuery.data?.expiringCertificatesCount ?? 0,
      ec2UnusedSecurityGroups:
        ec2UnusedSecurityGroupsQuery.data?.unusedSecurityGroupsCount ?? 0,
      ec2UnattachedVolumes:
        ec2UnattachedVolumesQuery.data?.unattachedVolumesCount ?? 0,
      vulnerabilities:
        (inspectorEcrQuery.data?.totalFindings ?? 0) +
        (inspectorEc2Query.data?.totalFindings ?? 0),
      security:
        (rdsPortsQuery.data?.instancesWithPublicPorts ?? 0) +
        (ec2PortsQuery.data?.instancesWithPublicPorts ?? 0) +
        (s3Query.data?.publicBucketsCount ?? 0) +
        (s3EncryptionQuery.data?.unencryptedBucketsCount ?? 0) +
        (lambdaQuery.data?.publicFunctionsCount ?? 0) +
        (acmQuery.data?.expiringCertificatesCount ?? 0) +
        (ec2UnusedSecurityGroupsQuery.data?.unusedSecurityGroupsCount ?? 0) +
        (ec2UnattachedVolumesQuery.data?.unattachedVolumesCount ?? 0),
      untaggedResources: untaggedQuery.data?.untaggedResourcesCount ?? 0,
      resourcesByProject: 0,
      audits: untaggedQuery.data?.untaggedResourcesCount ?? 0,
    }),
    [
      iamKeysQuery.data,
      iamUsersQuery.data,
      inspectorEcrQuery.data,
      inspectorEc2Query.data,
      ec2PortsQuery.data,
      rdsPortsQuery.data,
      s3Query.data,
      s3EncryptionQuery.data,
      lambdaQuery.data,
      acmQuery.data,
      ec2UnusedSecurityGroupsQuery.data,
      ec2UnattachedVolumesQuery.data,
      untaggedQuery.data,
    ],
  )

  const getBadge = (key: SidebarCountableKey): string | number | undefined =>
    formatSidebarBadge(counts[key])

  const getSectionBadge = (_sectionKey: SectionKey) => undefined

  const isLoading =
    iamKeysQuery.isLoading ||
    iamUsersQuery.isLoading ||
    inspectorEcrQuery.isLoading ||
    inspectorEc2Query.isLoading ||
    ec2PortsQuery.isLoading ||
    rdsPortsQuery.isLoading ||
    s3Query.isLoading ||
    s3EncryptionQuery.isLoading ||
    lambdaQuery.isLoading ||
    acmQuery.isLoading ||
    ec2UnusedSecurityGroupsQuery.isLoading ||
    ec2UnattachedVolumesQuery.isLoading ||
    untaggedQuery.isLoading

  return { getBadge, getSectionBadge, counts, isLoading, region }
}
