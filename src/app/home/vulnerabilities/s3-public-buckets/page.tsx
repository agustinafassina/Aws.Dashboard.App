import S3PublicBucketsView from '@/components/organism/S3PublicBucketsView'

export default function S3PublicBucketsPage() {
  return (
    <S3PublicBucketsView
      title="S3 public buckets"
      description="S3 buckets that are publicly accessible via policy, ACL, or missing Block Public Access settings."
    />
  )
}
