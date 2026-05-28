import OpenPortsView from '@/components/organism/OpenPortsView'

export default function RdsOpenPortsPage() {
  return (
    <OpenPortsView
      title="RDS open ports"
      description="RDS instances with security groups and ports exposed to the internet."
      resourceType="rds"
    />
  )
}
