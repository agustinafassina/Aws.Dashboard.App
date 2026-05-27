export interface ProjectCost {
  project: string
  amount: number
  currency: string
}

export interface CostByProjectResponse {
  startDate: string
  endDate: string
  totalAmount: number
  currency: string
  projectTagKey: string
  projects: ProjectCost[]
  scannedAt: string
}

export interface IamAccessKey {
  userName: string
  accessKeyId: string
  status: string
  createDate: string
  ageInDays: number
  lastUsedDate: string | null
  lastUsedService: string | null
  lastUsedRegion: string | null
  needsRotation: boolean
  recommendation: string
}

export interface IamAccessKeysResponse {
  totalUsers: number
  totalAccessKeys: number
  accessKeysNeedingRotation: number
  accessKeyRotationMaxAgeDays: number
  accessKeys: IamAccessKey[]
  scannedAt: string
}

export interface InspectorFindingResource {
  instanceId?: string | null
  vpcId?: string | null
  subnetId?: string | null
  imageId?: string | null
  functionName?: string | null
  runtime?: string | null
  repositoryName?: string | null
  imageHash?: string | null
  imageTags?: string[] | null
}

export interface InspectorFinding {
  findingArn: string
  title: string
  description?: string | null
  severity: string
  status: string
  type: string
  resourceType?: string | null
  resourceId?: string | null
  vulnerabilityId?: string | null
  fixAvailable?: string | null
  exploitAvailable?: string | null
  firstObservedAt?: string | null
  lastObservedAt?: string | null
  updatedAt?: string | null
  recommendation?: string | null
  resource?: InspectorFindingResource | null
}

export interface InspectorVulnerabilitiesResponse {
  region: string
  resourceTypeFilter?: string | null
  severityFilter?: string | null
  statusFilter?: string | null
  totalFindings: number
  hasMoreFindings: boolean
  findings: InspectorFinding[]
  scannedAt: string
}

export type InspectorResourceType = 'ecr' | 'ec2'
