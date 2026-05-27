import VulnerabilitiesView from '@/components/organism/VulnerabilitiesView'

export default function Ec2ServersVulnerabilitiesPage() {
  return (
    <VulnerabilitiesView
      title="EC2 server vulnerabilities"
      description="Amazon Inspector findings for EC2 instances in the selected region."
      resourceType="ec2"
    />
  )
}
