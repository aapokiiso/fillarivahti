import { sum } from './sum';

export type LinearRegressionResult = {
    slope: number,
    intercept: number,
};

/**
 * Linear regression which can be used to estimate a slope for a dataset.
 *
 * @param {Number[]} data
 * @returns {Object}
 */
export const linearRegression = function (data: number[]): LinearRegressionResult {
    if (data.length === 0) {
        throw new Error('data must not be empty.');
    }

    const x = [...Array(data.length).keys()];
    const y = data;

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
};
