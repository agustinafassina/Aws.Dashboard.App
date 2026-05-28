export function prefetchHomeViewModules(): void {
  void import('@/components/organism/DashboardSection')
  void import('@/components/organism/CostsView')
  void import('@/components/organism/IamAccessKeysView')
  void import('@/components/organism/VulnerabilitiesView')
  void import('@/components/organism/OpenPortsView')
  void import('@/components/organism/S3PublicBucketsView')
}
