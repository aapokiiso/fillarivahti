/**
 * Accounts for trends on stations with a lot of bikes, where an
 * addition/removal of several bikes might not cross the just-noticeable
 * difference threshold, but constitutes a clear trend nonetheless.
 *
 * @param {number} estimated
 * @param {number} current
 * @param {number} capacity
 * @returns number
 */
const getPercentOfCapacityDiff = (estimated: number, current: number, capacity: number): number =>
  capacity > 0
    ? (estimated - current) / capacity
    : 0

/**
 * Accounts for trends on stations with a few bikes, where an addition/removal
 * of even one or two bikes makes a noticeable difference, even if
 * percentage-wise the change is small.
 *
 * @param {number} estimated
 * @param {number} current
 * @returns {number}
 */
const getJustNoticeableDiff = (estimated: number, current: number): number =>
  current > 0
    ? (estimated - current) / current
    : estimated > 0 ? 1 : 0

export const isTrendingUp = (
  estimated: number,
  current: number,
  capacity: number,
  { percentOfCapacityDiffThreshold = 0.1, justNoticeableDiffThreshold = 0.1 } = {},
): boolean => {
  const percentOfCapacityDiff = getPercentOfCapacityDiff(estimated, current, capacity)
  const justNoticeableDiff = getJustNoticeableDiff(estimated, current)

  return percentOfCapacityDiff >= percentOfCapacityDiffThreshold && justNoticeableDiff >= justNoticeableDiffThreshold
}

export const isTrendingDown = (
  estimated: number,
  current: number,
  capacity: number,
  { percentOfCapacityDiffThreshold = 0.1, justNoticeableDiffThreshold = 0.1 } = {},
): boolean => {
  const percentOfCapacityDiff = getPercentOfCapacityDiff(estimated, current, capacity)
  const justNoticeableDiff = getJustNoticeableDiff(estimated, current)

  return percentOfCapacityDiff <= percentOfCapacityDiffThreshold * -1 && justNoticeableDiff <= justNoticeableDiffThreshold * -1
}
