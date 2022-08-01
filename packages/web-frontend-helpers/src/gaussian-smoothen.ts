/* eslint-disable no-magic-numbers */

/**
 * Sums numbers in dataset.
 *
 * @param {Number[]} dataset
 * @returns {Number}
 */
const sum = (dataset: number[]): number =>
    dataset.reduce((sum, value) => sum + value, 0);

/**
 * Standard deviation (sigma) of 2 makes the smoothing take into account two
 * adjacent values on both sides of a value when smoothing. It it a good
 * default for most time-series data, since it smoothens the biggest deviations
 * while keeping the overall trend visible.
 */
const DEFAULT_SIGMA = 2;

/**
 * Applies Gaussian smoothing on the dataset.
 *
 * @see https://en.wikipedia.org/wiki/Kernel_smoother#Gaussian_kernel_smoother
 *
 * @param {Number[]} dataset
 * @param {Number} [sigma]
 * @returns {Number[]}
 *
 * @throws {Error} If dataset is too small
 */
export const gaussianSmoothen = (dataset: number[], sigma: number = DEFAULT_SIGMA): number[] => {
    const kernelWidth = 2 * sigma + 1;

    if (dataset.length < kernelWidth) {
        return dataset;
    }

    return dataset.map((value, idx1) => {
        // Dataset edges would need circular processing.
        if (idx1 - sigma < 0 || idx1 + sigma >= dataset.length) {
            return value;
        }

        const kernel = dataset.map(
            (_, idx2) => Math.exp(
                -1 * (
                    Math.pow(idx2 - idx1, 2)
                    / (2 * Math.pow(sigma, 2))
                ),
            ),
        );

        const kernelSum = sum(kernel);

        const normalizedKernel = kernel.map(kernelValue => kernelValue / kernelSum);

        return sum(
            dataset.map((value, idx) => value * normalizedKernel[idx]),
        );
    });
};
