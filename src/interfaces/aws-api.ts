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

export interface IamOverprivilegedPolicy {
  policyArn: string
  policyName: string
  privilegeLevel: string
  riskReason: string
  riskyActions: string[]
  recommendation: string
}

export interface IamOverprivilegedPoliciesResponse {
  totalCustomerPoliciesScanned: number
  overprivilegedPolicyCount: number
  criticalPolicyCount: number
  highPolicyCount: number
  mediumPolicyCount: number
  policies: IamOverprivilegedPolicy[]
  scannedAt: string
}

export interface IamAdminPrivilegeGrant {
  principalType: string
  principalName: string
  principalArn: string | null
  policyArn: string
  policyName: string
  privilegeLevel: string
  attachmentType: string
  inheritedFromGroup: string | null
  recommendation: string
}

export interface IamAdminPrivilegeGrantsResponse {
  totalUsersScanned: number
  totalGroupsScanned: number
  totalRolesScanned: number
  adminPrivilegeGrantCount: number
  usersWithAdminAccess: number
  groupsWithAdminAccess: number
  rolesWithAdminAccess: number
  grants: IamAdminPrivilegeGrant[]
  scannedAt: string
}

export interface IamCrossAccountRole {
  roleName: string
  roleArn: string
  trustRiskReason: string
  trustedPrincipals: string[]
  allowsAnyPrincipal: boolean
  recommendation: string
}

export interface IamCrossAccountRolesResponse {
  currentAccountId: string
  totalRolesScanned: number
  crossAccountRolesCount: number
  roles: IamCrossAccountRole[]
  scannedAt: string
}

export interface IamRootAccountStatusResponse {
  accountId: string
  mfaEnabled: boolean
  hasActiveAccessKeys: boolean
  hasSigningCertificate: boolean
  passwordEnabled: boolean
  accessKey1Active: boolean
  accessKey2Active: boolean
  passwordLastUsed: string | null
  accessKey1LastUsed: string | null
  accessKey2LastUsed: string | null
  credentialReportAvailable: boolean
  isCompliant: boolean
  riskReasons: string[]
  recommendation: string
  scannedAt: string
}

export interface IamInlinePolicy {
  principalType: string
  principalName: string
  principalArn: string | null
  policyName: string
  hasWildcardAdminRisk: boolean
  riskReason: string | null
  recommendation: string
}

export interface IamInlinePoliciesResponse {
  totalUsersScanned: number
  totalGroupsScanned: number
  totalRolesScanned: number
  inlinePolicyCount: number
  riskyInlinePolicyCount: number
  policies: IamInlinePolicy[]
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

export interface Ec2UnusedSecurityGroup {
  groupId: string
  groupName: string
  description?: string | null
  vpcId?: string | null
  isDefaultSecurityGroup: boolean
  inboundRuleCount: number
  outboundRuleCount: number
  recommendation: string
}

export interface Ec2UnusedSecurityGroupsResponse {
  region: string
  totalSecurityGroups: number
  unusedSecurityGroupsCount: number
  securityGroups: Ec2UnusedSecurityGroup[]
  scannedAt: string
}

export interface Ec2UnattachedVolume {
  volumeId: string
  name?: string | null
  sizeGiB: number
  volumeType?: string | null
  state?: string | null
  encrypted: boolean
  snapshotId?: string | null
  availabilityZone?: string | null
  createdAt?: string | null
  recommendation: string
}

export interface Ec2UnattachedVolumesResponse {
  region: string
  totalVolumes: number
  unattachedVolumesCount: number
  totalUnattachedSizeGiB: number
  volumes: Ec2UnattachedVolume[]
  scannedAt: string
}

export interface Ec2Imdsv1Instance {
  instanceId: string
  name?: string | null
  state?: string | null
  instanceType?: string | null
  httpTokens?: string | null
  httpEndpoint?: string | null
  recommendation: string
}

export interface Ec2Imdsv1InstancesResponse {
  region: string
  totalInstances: number
  imdsv1InstancesCount: number
  instances: Ec2Imdsv1Instance[]
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

export interface RdsUnencryptedInstance {
  dbInstanceIdentifier: string
  engine: string
  engineVersion?: string | null
  status?: string | null
  storageType?: string | null
  allocatedStorageGiB?: number | null
  storageEncrypted: boolean
  kmsKeyId?: string | null
  recommendation: string
}

export interface RdsUnencryptedInstancesResponse {
  region: string
  totalInstances: number
  unencryptedInstancesCount: number
  instances: RdsUnencryptedInstance[]
  scannedAt: string
}

export interface RdsNoBackupInstance {
  dbInstanceIdentifier: string
  engine: string
  engineVersion?: string | null
  status?: string | null
  backupRetentionPeriodDays: number
  preferredBackupWindow?: string | null
  latestRestorableTime?: string | null
  riskReason: string
  recommendation: string
}

export interface RdsNoBackupsResponse {
  region: string
  minBackupRetentionDays: number
  totalInstances: number
  instancesWithoutAdequateBackupsCount: number
  instances: RdsNoBackupInstance[]
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

export interface S3BucketEncryption {
  name: string
  region: string
  creationDate: string
  recommendation: string
}

export interface S3EncryptionStatusResponse {
  region: string
  totalBucketsInRegion: number
  unencryptedBucketsCount: number
  unencryptedBuckets: S3BucketEncryption[]
  scannedAt: string
}

export interface LambdaPublicFunction {
  functionName: string
  functionArn: string
  runtime?: string | null
  state?: string | null
  functionUrl?: string | null
  publicAccessReasons: string[]
  recommendation: string
}

export interface LambdaPublicFunctionsResponse {
  region: string
  totalFunctions: number
  publicFunctionsCount: number
  functions: LambdaPublicFunction[]
  scannedAt: string
}

export interface EcrRepositoryRisk {
  repositoryName: string
  repositoryArn: string
  isPublic: boolean
  scanOnPushEnabled: boolean
  riskReasons: string[]
  recommendation: string
}

export interface EcrRepositoryRisksResponse {
  region: string
  totalRepositoriesScanned: number
  repositoriesAtRiskCount: number
  repositories: EcrRepositoryRisk[]
  scannedAt: string
}

export interface ElbListenerDetail {
  port: number
  protocol: string
}

export interface ElbPublicListener {
  loadBalancerName: string
  loadBalancerArn: string
  loadBalancerType: string
  scheme: string
  listeners: ElbListenerDetail[]
  riskReasons: string[]
  recommendation: string
}

export interface ElbPublicListenersResponse {
  region: string
  totalLoadBalancersScanned: number
  publicLoadBalancersCount: number
  loadBalancers: ElbPublicListener[]
  scannedAt: string
}

export interface AcmExpiringCertificate {
  certificateArn: string
  domainName: string
  subjectAlternativeNames: string[]
  status?: string | null
  type?: string | null
  inUse: boolean
  notBefore?: string | null
  notAfter?: string | null
  daysUntilExpiry: number
  isExpired: boolean
  recommendation: string
}

export interface AcmExpiringCertificatesResponse {
  region: string
  expirationWindowDays: number
  totalCertificatesScanned: number
  expiringCertificatesCount: number
  expiredCertificatesCount: number
  certificates: AcmExpiringCertificate[]
  scannedAt: string
}

export interface UntaggedResource {
  resourceType: string
  resourceId: string
  name: string | null
  region: string
  state: string | null
  recommendation: string
}

export interface UntaggedResourcesResponse {
  region: string
  requiredTagKey: string
  totalResourcesScanned: number
  untaggedResourcesCount: number
  resources: UntaggedResource[]
  scannedAt: string
}

export interface TaggedResource {
  resourceType: string
  resourceId: string
  name: string | null
  region: string
  state: string | null
  projectTagValue: string
}

export interface ResourcesByProjectTagResponse {
  region: string
  projectTagKey: string
  projectTagValue: string
  totalResourcesScanned: number
  matchingResourcesCount: number
  resources: TaggedResource[]
  scannedAt: string
}

export interface SecuritySummaryResponse {
  region: string
  certificateExpirationWindowDays: number
  totalFindings: number
  publicBuckets: number
  unencryptedBuckets: number
  instancesWithOpenPorts: number
  unusedSecurityGroups: number
  unattachedVolumes: number
  rdsInstancesWithOpenPorts: number
  unencryptedRdsInstances: number
  imdsv1Instances: number
  publicLambdaFunctions: number
  publicLoadBalancers: number
  ecrRepositoriesAtRisk: number
  expiringCertificates: number
  expiredCertificates: number
  activeInspectorFindings: number
  untaggedResources: number
  accessKeysNeedingRotation: number
  accessKeysNeverUsed: number
  usersWithoutMfa: number
  riskyPolicies: number
  adminPrivilegeGrants: number
  crossAccountRoles: number
  rootAccountRiskCount: number
  riskyInlinePolicies: number
  scannedAt: string
}
