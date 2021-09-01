/**
 * Sums numbers in dataset.
 *
 * @param {Number[]} dataset
 * @returns {Number}
 */
const sum = (dataset: number[]): number =>
    dataset.reduce((sum, value) => sum + value, 0);

/**
 * Kernel radius of 2 is a sensible default for most use cases. It smoothens
 * any entry in the dataset with its 2 closest neighbors on both sides.
 */
const DEFAULT_KERNEL_RADIUS = 2;

/**
 * Applies Gaussian smoothing on the dataset.
 *
 * @see https://en.wikipedia.org/wiki/Kernel_smoother#Gaussian_kernel_smoother
 *
 * @param {Number[]} dataset
 * @param {Number} [kernelRadius]
 * @returns {Number[]}
 *
 * @throws {Error} If dataset is too small
 */
const gaussianSmoothen = (dataset: number[], kernelRadius: number = DEFAULT_KERNEL_RADIUS): number[] => {
    const radiusFactor = 2;
    const kernelDiameter = radiusFactor * kernelRadius + 1;

    if (dataset.length < kernelDiameter) {
        throw new Error(`Dataset needs to be larger than the kernel diameter (${kernelDiameter}).`);
    }

    return dataset.map((value, idx1) => {
        // Dataset edges would need circular processing.
        if (idx1 - kernelRadius < 0 || idx1 + kernelRadius >= dataset.length) {
            return value;
        }

        const squareExponent = 2;
        const kernelFactor = 2;

        const kernel = dataset.map(
            (_, idx2) => Math.exp(
                -1 * (
                    Math.pow(idx2 - idx1, squareExponent)
                    / (kernelFactor * Math.pow(kernelRadius, squareExponent))
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

export default gaussianSmoothen;
