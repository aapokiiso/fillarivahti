import sum from './sum';

export type LinearRegressionResult = {
    slope: number,
    intercept: number,
};

/**
 * Linear regression which can be used to estimate a slope for a dataset.
 *
 * @param {Number[]} x
 * @param {Number[]} y
 * @returns {Object}
 */
const linearRegression = function (x: number[], y: number[]): LinearRegressionResult {
    if (x.length === 0) {
        throw new Error('x must not be empty.');
    }

    if (y.length === 0) {
        throw new Error('y must not be empty.');
    }

    if (x.length !== y.length) {
        throw new Error('x and y must have the same length.');
    }

    const xAvg = sum(x) / x.length;
    const yAvg = sum(y) / y.length;

    const xDiff = x.map(val => val - xAvg);
    const xDiffSquared = xDiff.map(val => val * val);
    const yDiff = y.map(val => val - yAvg);
    const diffProduct = xDiff.map((val, idx) => val * yDiff[idx]);

    const slope = sum(diffProduct) / sum(xDiffSquared);
    const intercept = yAvg - slope * xAvg;

    return {
        slope,
        intercept,
    };
}

export default linearRegression;
