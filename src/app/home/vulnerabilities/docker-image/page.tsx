import VulnerabilitiesView from '@/components/organism/VulnerabilitiesView'

export default function DockerImageVulnerabilitiesPage() {
  return (
    <VulnerabilitiesView
      title="Docker image vulnerabilities"
      description="Amazon Inspector findings for container images in ECR."
      resourceType="ecr"
    />
  )
}
