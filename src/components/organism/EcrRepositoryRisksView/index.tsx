'use client'

import { useCallback, useMemo } from 'react'
import DockerIcon from '@/components/atoms/Icons/DockerIcon'
import ShieldIcon from '@/components/atoms/Icons/ShieldIcon'
import { CardSkeleton } from '@/components/atoms/Skeleton'
import ErrorState from '@/components/molecules/ErrorState'
import PageHeader from '@/components/molecules/PageHeader'
import StatCard from '@/components/molecules/StatCard'
import TableSection from '@/components/molecules/TableSection'
import { useAwsRegion } from '@/context/RegionContext'
import { useEcrRepositoryRisks } from '@/hooks/useEcrRepositoryRisks'
import { usePdfReport } from '@/hooks/usePdfReport'
import type { EcrRepositoryRisk } from '@/interfaces/aws-api'
import type { Column } from '@/interfaces/common'
import { pageContentShellMinHeight } from '@/styles/pageShell'
import { exportTableToPdf } from '@/utils/exportPdf'
import { ERROR_MESSAGE } from '@/utils/sharedConstants'

const columns: Column<EcrRepositoryRisk>[] = [
  {
    key: 'repositoryName',
    label: 'Repository',
    cellClassName: 'whitespace-nowrap font-mono text-xs',
  },
  {
    key: 'isPublic',
    label: 'Public',
    cellClassName: 'whitespace-nowrap',
    render: (value) => (value ? 'Yes' : 'No'),
  },
  {
    key: 'scanOnPushEnabled',
    label: 'Scan on push',
    cellClassName: 'whitespace-nowrap',
    render: (value) => (value ? 'Enabled' : 'Disabled'),
  },
  {
    key: 'riskReasons',
    label: 'Risk reasons',
    cellClassName: 'min-w-[12rem] whitespace-normal text-xs leading-snug',
    render: (value) => ((value as string[]) ?? []).join('; ') || '—',
  },
  {
    key: 'recommendation',
    label: 'Recommendation',
    cellClassName: 'min-w-[12rem] whitespace-normal text-xs leading-snug',
  },
]

interface EcrRepositoryRisksViewProps {
  title: string
  description: string
}

export default function EcrRepositoryRisksView({
  title,
  description,
}: EcrRepositoryRisksViewProps) {
  const { region } = useAwsRegion()
  const { buildReport } = usePdfReport()
  const { data, isLoading, isError, error, refetch } = useEcrRepositoryRisks(region)

  const repositories = useMemo(
    () => [...(data?.repositories ?? [])].sort((a, b) => a.repositoryName.localeCompare(b.repositoryName)),
    [data?.repositories],
  )

  const handleExportPdf = useCallback(() => {
    if (!data || repositories.length === 0) return
    exportTableToPdf({
      filename: `ecr-repository-risks-${data.region}`,
      title,
      subtitle: `Region: ${data.region}`,
      report: buildReport({
        region: data.region,
        scannedAt: data.scannedAt,
        executiveSummary: [
          `${data.repositoriesAtRiskCount} of ${data.totalRepositoriesScanned} repositories have risk conditions.`,
        ],
      }),
      columns: [
        { header: 'Repository', value: (row) => row.repositoryName },
        { header: 'Public', value: (row) => (row.isPublic ? 'Yes' : 'No') },
        {
          header: 'Scan on push',
          value: (row) => (row.scanOnPushEnabled ? 'Enabled' : 'Disabled'),
        },
        { header: 'Risk reasons', value: (row) => row.riskReasons.join('; ') },
        { header: 'Recommendation', value: (row) => row.recommendation },
      ],
      rows: repositories,
    })
  }, [buildReport, data, repositories, title])

  return (
    <div className={pageContentShellMinHeight}>
      <PageHeader title={title} description={description} />
      {isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <div className="h-48 animate-pulse rounded-xl bg-gray_200 dark:bg-gray_700" />
        </div>
      )}
      {isError && (
        <ErrorState
          message={
            (error as { response?: { data?: { message?: string; error?: string } } })?.response
              ?.data?.message ??
            (error as { response?: { data?: { error?: string } } })?.response?.data?.error ??
            ERROR_MESSAGE
          }
          onRetry={() => refetch()}
        />
      )}
      {data && !isLoading && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="Repositories scanned"
              value={data.totalRepositoriesScanned}
              icon={<DockerIcon className="h-5 w-5" />}
            />
            <StatCard
              label="Repositories at risk"
              value={data.repositoriesAtRiskCount}
              variant={data.repositoriesAtRiskCount > 0 ? 'warning' : 'success'}
              icon={<ShieldIcon className="h-5 w-5" />}
            />
            <StatCard label="Region" value={data.region} />
          </div>
          <TableSection
            title="Repositories"
            onExportPdf={handleExportPdf}
            exportDisabled={repositories.length === 0}
            columns={columns}
            data={repositories}
            emptyMessage="No ECR repository risks found in this region."
            getRowKey={(row) => row.repositoryArn}
          />
        </>
      )}
    </div>
  )
}
