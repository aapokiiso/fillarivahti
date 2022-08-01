import { singleton } from 'tsyringe';
import { AvailabilityEstimation } from '../interface/AvailabilityEstimation';
import { Capacity } from '@aapokiiso/fillarivahti-capacity-repository';
import { linearRegression, LinearRegressionResult, slopeAngle, roundPrecision } from '@aapokiiso/fillarivahti-helpers';

const DEFAULT_GRANULARITY_IN_MINUTES = 5;
const DEFAULT_REGRESSION_INTERVAL_IN_MINUTES = 60;
const DEFAULT_ESTIMATION_INTERVAL_IN_MINUTES = 30;

const decimalPrecision = 2;
const percentMultiplier = 100;
const minuteInMillis = 60000;

@singleton()
export class LinearRegressionAvailabilityEstimation implements AvailabilityEstimation {
    estimate(
        todayAvailabilities: Capacity[],
        weekdayAverageAvailabilities: Capacity[],
        {
            granularityInMinutes = DEFAULT_GRANULARITY_IN_MINUTES,
            regressionIntervalInMinutes = DEFAULT_REGRESSION_INTERVAL_IN_MINUTES,
            estimationIntervalInMinutes = DEFAULT_ESTIMATION_INTERVAL_IN_MINUTES,
        } = {},
    ): Capacity[] | null {
        const pivotIndex = Math.max(todayAvailabilities.length - 1, 0);
        const regressionIntervalLength = this.getRegressionIntervalLength(granularityInMinutes, regressionIntervalInMinutes);

        const pastLinearRegressionForToday = this.getPastLinearRegressionForToday(todayAvailabilities, pivotIndex, regressionIntervalLength);
        const futureLinearRegressionForWeekdayAverage = this.getFutureLinearRegressionForWeekdayAverage(weekdayAverageAvailabilities, pivotIndex, regressionIntervalLength);

        if (!(pastLinearRegressionForToday && futureLinearRegressionForWeekdayAverage)) {
            return null;
        }

        const { slope: todayPastSlope } = pastLinearRegressionForToday;
        const { slope: weekdayAverageFutureSlope } = futureLinearRegressionForWeekdayAverage;

        const pastLinearRegressionForWeekdayAverage = this.getPastLinearRegressionForWeekdayAverage(weekdayAverageAvailabilities, pivotIndex, regressionIntervalLength);
        const resemblance = this.getResemblance(pastLinearRegressionForToday, pastLinearRegressionForWeekdayAverage);

        // When there is no resemblance, today's slope is amplified in the
        // estimate, since the weekday average slope is not likely a good
        // prediction. Conversely, when there is strong resemblance,
        // the weekday average slope is amplified in the estimate, since
        // it is likely a good prediction.

        const estimateSlope
            = resemblance !== null
                ? todayPastSlope * (1 - resemblance)
                  + weekdayAverageFutureSlope * resemblance
                : todayPastSlope;

        // Construct future availabilities from estimated slope.

        const estimationIntervalLength = this.getEstimationIntervalLength(granularityInMinutes, estimationIntervalInMinutes);
        const pivotAvailability = todayAvailabilities[pivotIndex];

        return [...Array(estimationIntervalLength).keys()].map((_, idx) => {
            const nth = idx + 1;

            const percentEstimate = Math.max(
                pivotAvailability.capacity*percentMultiplier + nth*estimateSlope,
                0,
            );

            const estimate = percentEstimate / percentMultiplier;

            return {
                stationId: pivotAvailability.stationId,
                timestamp: new Date(pivotAvailability.timestamp.getTime() + nth*granularityInMinutes*minuteInMillis),
                capacity: estimate,
            };
        });
    }

    private getResemblance (
        pastLinearRegressionForToday: LinearRegressionResult|null,
        pastLinearRegressionForWeekdayAverage: LinearRegressionResult|null,
    ): number | null {
        if (!(pastLinearRegressionForToday && pastLinearRegressionForWeekdayAverage)) {
            return null;
        }

        const { slope: todaySlope } = pastLinearRegressionForToday;
        const { slope: weekdayAverageSlope } = pastLinearRegressionForWeekdayAverage;

        // Resemblance as cosine of difference in slopes' angles
        // - adjacent: cos(0deg difference) -> 1 (total resemblance)
        // - normal: cos(+90deg difference) -> 0 (no resemblance)

        // Calculate slope angles in relation to the x-axis.

        const todaySlopeAngle = slopeAngle(todaySlope, 0);
        const weekdayAverageSlopeAngle = slopeAngle(weekdayAverageSlope, 0);

        // The difference of the two slopes' angles can be used to
        // calculate resemblance. Cap it to 90deg to not flip cosine back
        // towards 0 if angle difference is over 90deg. For example,
        // cos(180deg) -> 0 (would erroneuously report total resemblance)
        // on completely opposite slopes.

        // eslint-disable-next-line no-magic-numbers
        const ninetyDegInRad = Math.PI / 2;
        const diffAngle = Math.min(
            Math.abs(todaySlopeAngle - weekdayAverageSlopeAngle),
            ninetyDegInRad,
        );

        // Math.cos has issues with high-precision floating point
        // arithmetic. Round to two decimals, which is enough precision for
        // this use case.
        const diffAngleRounded = roundPrecision(
            diffAngle,
            decimalPrecision,
        );

        return roundPrecision(
            Math.cos(diffAngleRounded),
            decimalPrecision,
        );
    }

    private getPastLinearRegressionForToday (todayAvailabilities: Capacity[], pivotIndex: number, regressionIntervalLength: number): LinearRegressionResult | null {
        return this.getPastLinearRegression(
            todayAvailabilities.map(this.mapAvailabilityToPercent),
            pivotIndex,
            regressionIntervalLength,
        );
    }

    private getPastLinearRegressionForWeekdayAverage (weekdayAverageAvailabilities: Capacity[], pivotIndex: number, regressionIntervalLength: number): LinearRegressionResult | null {
        return this.getPastLinearRegression(
            weekdayAverageAvailabilities.map(this.mapAvailabilityToPercent),
            pivotIndex,
            regressionIntervalLength,
        );
    }

    private getFutureLinearRegressionForWeekdayAverage (weekdayAverageAvailabilities: Capacity[], pivotIndex: number, regressionIntervalLength: number): LinearRegressionResult | null {
        return this.getFutureLinearRegression(
            weekdayAverageAvailabilities.map(this.mapAvailabilityToPercent),
            pivotIndex,
            regressionIntervalLength,
        );
    }

    private getPastLinearRegression (data: number[], pivotIndex: number, regressionIntervalLength: number): LinearRegressionResult | null {
        const startIndex = Math.max(
            pivotIndex - regressionIntervalLength,
            0,
        );

        const dataSample = data.slice(startIndex, pivotIndex);

        return dataSample.length > 0 ? linearRegression(dataSample) : null;
    }

    private getFutureLinearRegression (data: number[], pivotIndex: number, regressionIntervalLength: number): LinearRegressionResult | null {
        const endIndex = Math.min(
            pivotIndex + regressionIntervalLength,
            data.length,
        );

        const dataSample = data.slice(pivotIndex + 1, endIndex + 1);

        return dataSample.length > 0 ? linearRegression(dataSample) : null;
    }

    private getRegressionIntervalLength (granularityInMinutes: number, regressionIntervalInMinutes: number): number {
        return Math.floor(
            regressionIntervalInMinutes / granularityInMinutes,
        );
    }

    private getEstimationIntervalLength (granularityInMinutes: number, estimationIntervalInMinutes: number): number {
        return Math.floor(
            estimationIntervalInMinutes / granularityInMinutes,
        );
    }

    private mapAvailabilityToPercent (availabilityRecord: Capacity): number {
        const { capacity } = availabilityRecord;

        return capacity * percentMultiplier;
    }
}
