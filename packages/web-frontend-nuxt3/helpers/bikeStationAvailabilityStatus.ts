export enum AvailabilityStatus {
  Good,
  Low,
  Bad,
  Unknown
}

export const getAvailabilityStatus = (
  bikesAvailable?: number,
  capacity?: number,
  { maxBadAvailabilityPercent = 0.15, maxLowAvailabilityPercent = 0.325 } = {},
): AvailabilityStatus => {
  const maxBadAvailabilityCount = Math.round(capacity * maxBadAvailabilityPercent)
  const maxLowAvailabilityCount = Math.round(capacity * maxLowAvailabilityPercent)

  if (bikesAvailable === null) {
    return AvailabilityStatus.Unknown
  } else if (bikesAvailable <= maxBadAvailabilityCount) {
    return AvailabilityStatus.Bad
  } else if (bikesAvailable <= maxLowAvailabilityCount) {
    return AvailabilityStatus.Low
  }

  return AvailabilityStatus.Good
}
