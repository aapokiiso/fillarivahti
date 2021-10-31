<template>
    <div v-if="bikesEstimate !== null" class="capacity-estimate">
        <CapacityStatus
            :label="
                $t('capacityEstimate.label', {
                    minutes: estimationIntervalInMinutes,
                })
            "
            :bikes-available="bikesEstimate"
            :capacity="stationCapacity"
            class="capacity-estimate__status"
        />
    </div>
</template>

<script lang="ts">
// ESLint does not recognized PropType exported by the Composition API.
// eslint-disable-next-line import/named
import { defineComponent, PropType } from '@vue/composition-api';
import linearRegression, {
    LinearRegressionResult,
} from '~/helpers/linear-regression';
import slopeAngle from '~/helpers/slope-angle';
import { Capacity } from '~/api/capacities';

const decimalPrecision = 2;
const percentMultiplier = 100;

export default defineComponent({
    props: {
        stationCapacity: {
            type: Number,
            required: true,
        },
        todayCapacities: {
            type: Array as PropType<Capacity[]>,
            required: true,
        },
        weekdayAverageCapacities: {
            type: Array as PropType<Capacity[]>,
            required: true,
        },
        granularityInMinutes: {
            type: Number,
            default: 5,
        },
        regressionIntervalInMinutes: {
            type: Number,
            default: 60,
        },
        estimationIntervalInMinutes: {
            type: Number,
            default: 30,
        },
    },
    computed: {
        currentCapacity (): number {
            const { capacity } = this.todayCapacities[this.nowIndex] || {};

            return capacity || 0;
        },
        regressionIntervalLength (): number {
            return Math.floor(
                this.regressionIntervalInMinutes / this.granularityInMinutes,
            );
        },
        estimationIntervalLength (): number {
            return Math.floor(
                this.estimationIntervalInMinutes / this.granularityInMinutes,
            );
        },
        nowIndex (): number {
            const minutesInHour = 60;

            const now = new Date();

            const nowMinutes
                = now.getHours() * minutesInHour + now.getMinutes();

            return Math.floor(nowMinutes / this.granularityInMinutes);
        },
        pastLinearRegressionForToday (): LinearRegressionResult | null {
            return this.getPastLinearRegression(
                this.todayCapacities.map(this.mapCapacityToPercent),
            );
        },
        pastLinearRegressionForWeekdayAverage (): LinearRegressionResult | null {
            return this.getPastLinearRegression(
                this.weekdayAverageCapacities.map(this.mapCapacityToPercent),
            );
        },
        futureLinearRegressionForWeekdayAverage (): LinearRegressionResult | null {
            return this.getFutureLinearRegression(
                this.weekdayAverageCapacities.map(this.mapCapacityToPercent),
            );
        },
        resemblance (): number | null {
            if (
                !(
                    this.pastLinearRegressionForToday
                    && this.pastLinearRegressionForWeekdayAverage
                )
            ) {
                return null;
            }

            const { slope: todaySlope } = this.pastLinearRegressionForToday;
            const { slope: weekdayAverageSlope }
                = this.pastLinearRegressionForWeekdayAverage;

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
            const diffAngleRounded = this.roundPrecision(
                diffAngle,
                decimalPrecision,
            );

            return this.roundPrecision(
                Math.cos(diffAngleRounded),
                decimalPrecision,
            );
        },
        percentageEstimate (): number | null {
            if (
                !(
                    this.pastLinearRegressionForToday
                    && this.futureLinearRegressionForWeekdayAverage
                )
            ) {
                return null;
            }

            const { slope: todayPastSlope } = this.pastLinearRegressionForToday;
            const { slope: weekdayAverageFutureSlope }
                = this.futureLinearRegressionForWeekdayAverage;

            // When there is no resemblance, today's slope is amplified in the
            // estimate, since the weekday average slope is not likely a good
            // prediction. Conversely, when there is strong resemblance,
            // the weekday average slope is amplified in the estimate, since
            // it is likely a good prediction.

            const estimateSlope
                = this.resemblance !== null
                    ? todayPastSlope * (1 - this.resemblance)
                      + weekdayAverageFutureSlope * this.resemblance
                    : todayPastSlope;

            const percentEstimate = Math.max(
                this.currentCapacity * percentMultiplier
                    + estimateSlope * this.estimationIntervalLength,
                0,
            );

            return percentEstimate / percentMultiplier;
        },
        bikesEstimate (): number | null {
            return this.percentageEstimate !== null
                ? Math.round(this.stationCapacity * this.percentageEstimate)
                : null;
        },
    },
    methods: {
        roundPrecision (value: number, precision: number): number {
            const base = 10;
            const coefficient = Math.pow(base, precision);

            return Math.round(value * coefficient) / coefficient;
        },
        mapCapacityToPercent (capacityRecord: Capacity): number {
            const { capacity } = capacityRecord;

            return capacity * percentMultiplier;
        },
        getPastLinearRegression (data: number[]): LinearRegressionResult | null {
            const startIndex = Math.max(
                this.nowIndex - this.regressionIntervalLength,
                0,
            );

            const sampleData = data.slice(startIndex, this.nowIndex);

            return sampleData.length > 0 ? linearRegression(sampleData) : null;
        },
        getFutureLinearRegression (
            data: number[],
        ): LinearRegressionResult | null {
            const endIndex = Math.min(
                this.nowIndex + this.regressionIntervalLength,
                data.length,
            );

            const sampleData = data.slice(this.nowIndex + 1, endIndex + 1);

            return sampleData.length > 0 ? linearRegression(sampleData) : null;
        },
    },
});
</script>
