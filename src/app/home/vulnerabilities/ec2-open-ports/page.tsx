import OpenPortsView from '@/components/organism/OpenPortsView'

export default function Ec2OpenPortsPage() {
  return (
    <OpenPortsView
      title="EC2 open ports"
      description="EC2 instances with security groups and inbound ports open to the internet."
      resourceType="ec2"
    />
  )
}
