export const PERFUME_SIZE_OPTIONS = [
  '3ml',
  '5ml',
  '10ml',
  '15ml',
  '30ml',
  'full presentation',
] as const

export type PerfumeSize = (typeof PERFUME_SIZE_OPTIONS)[number]
