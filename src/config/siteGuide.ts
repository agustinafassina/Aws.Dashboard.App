export const GUIDE_SECTION_IDS = [
  'general',
  'dashboard',
  'costs',
  'iam',
] as const

export type GuideSectionId = (typeof GUIDE_SECTION_IDS)[number]
