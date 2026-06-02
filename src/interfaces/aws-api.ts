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
  isNeverUsed: boolean
  recommendation: string
}

export interface IamAccessKeysResponse {
  totalUsers: number
  totalAccessKeys: number
  accessKeysNeedingRotation: number
  accessKeysNeverUsed: number
  accessKeyRotationMaxAgeDays: number
  accessKeys: IamAccessKey[]
  scannedAt: string
}

export interface IamUserWithoutMfa {
  userName: string
  email: string | null
  userCreated: string | null
  recommendation: string
}

export interface IamUsersWithoutMfaResponse {
  totalUsers: number
  usersWithConsoleAccess: number
  usersWithoutMfa: number
  users: IamUserWithoutMfa[]
  scannedAt: string
}

export interface IamRiskyPolicy {
  policyArn: string
  policyName: string
  riskReason: string
  recommendation: string
}

export interface IamRiskyPoliciesResponse {
  totalCustomerPoliciesScanned: number
  riskyPolicyCount: number
  policies: IamRiskyPolicy[]
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

export interface InboundRule {
  protocol: string
  fromPort?: number | null
  toPort?: number | null
  portRange: string
  source: string
  sourceType: string
  isPubliclyExposed: boolean
  description?: string | null
}

export interface SecurityGroup {
  groupId: string
  groupName: string
  description?: string | null
  inboundRules: InboundRule[]
}

export interface Ec2InstancePorts {
  instanceId: string
  name?: string | null
  state: string
  instanceType?: string | null
  privateIpAddress?: string | null
  publicIpAddress?: string | null
  securityGroups: SecurityGroup[]
  hasPubliclyExposedPorts: boolean
  publiclyExposedInboundRules: InboundRule[]
  recommendation: string
}

export interface Ec2OpenPortsResponse {
  region: string
  totalInstances: number
  instancesWithPublicPorts: number
  instances: Ec2InstancePorts[]
  scannedAt: string
}

export interface RdsInstancePorts {
  dbInstanceIdentifier: string
  engine: string
  engineVersion?: string | null
  status: string
  endpoint?: string | null
  port?: number | null
  publiclyAccessible: boolean
  securityGroups: SecurityGroup[]
  hasPubliclyExposedPorts: boolean
  publiclyExposedInboundRules: InboundRule[]
  recommendation: string
}

export interface RdsOpenPortsResponse {
  region: string
  totalInstances: number
  instancesWithPublicPorts: number
  instances: RdsInstancePorts[]
  scannedAt: string
}

export type OpenPortsResourceType = 'ec2' | 'rds'

export interface S3PublicBucket {
  name: string
  region: string
  publicAccessReasons: string[]
  recommendation: string
  creationDate: string
}

export interface S3PublicBucketsResponse {
  region: string
  totalBucketsInRegion: number
  publicBucketsCount: number
  publicBuckets: S3PublicBucket[]
  scannedAt: string
}
