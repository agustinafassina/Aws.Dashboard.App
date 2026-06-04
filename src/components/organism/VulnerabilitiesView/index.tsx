'use client'

import type { InspectorResourceType } from '@/interfaces/aws-api'
import EcrByRepositoryContent from './EcrByRepositoryContent'
import Ec2ByServerContent from './Ec2ByServerContent'

interface VulnerabilitiesViewProps {
  title: string
  description: string
  resourceType: InspectorResourceType
}

export default function VulnerabilitiesView({
  title,
  description,
  resourceType,
}: VulnerabilitiesViewProps) {
  if (resourceType === 'ecr') {
    return <EcrByRepositoryContent title={title} description={description} />
  }

  return <Ec2ByServerContent title={title} description={description} />
}
