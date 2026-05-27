import dynamic from 'next/dynamic'
import HomeLoading from '../loading'

const CostsView = dynamic(
  () => import('@/components/organism/CostsView'),
  { loading: () => <HomeLoading /> },
)

export default function CostsPage() {
  return <CostsView />
}
