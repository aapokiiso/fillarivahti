/**
 * Sums numbers in dataset.
 *
 * @param {Number[]} dataset
 * @returns {Number}
 */
export const sum = (dataset: number[]): number =>
    dataset.reduce((sum, value) => sum + value, 0);
