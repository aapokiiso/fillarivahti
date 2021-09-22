<template>
    <div>
        <p>Resemblance: {{resemblance}}</p>
        <p>Estimate in {{estimationIntervalInMinutes}}min: {{estimate}}%</p>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/composition-api";
import linearRegression, {LinearRegressionResult} from '~/helpers/linear-regression';
import slopeAngle from '~/helpers/slope-angle';
import {
    Capacity,
} from "~/api/capacities";

export default defineComponent({
    props: {
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
            default: 30,
        },
        estimationIntervalInMinutes: {
            type: Number,
            default: 15,
        }
    },
    computed: {
        regressionIntervalLength(): number {
            return Math.floor(this.regressionIntervalInMinutes / this.granularityInMinutes);
        },
        estimationIntervalLength(): number {
            return Math.floor(this.estimationIntervalInMinutes / this.granularityInMinutes);
        },
        nowIndex(): number {
            const hoursInDay = 24;
            const minutesInHour = 60;

            const now = new Date();

            const nowMinutes = now.getHours() * minutesInHour + now.getMinutes();

            return Math.floor(nowMinutes / this.granularityInMinutes);
        },
        startIndex(): number {
            return this.nowIndex - this.regressionIntervalLength;
        },
        linearRegressionForToday(): LinearRegressionResult | null {
            return this.getLinearRegression(this.todayCapacities.map(({capacity}) => capacity * 100));
        },
        linearRegressionForWeekdayAverage(): LinearRegressionResult | null {
            return this.getLinearRegression(this.weekdayAverageCapacities.map(({capacity}) => capacity * 100));
        },
        resemblance(): number|null {
            if (!(this.linearRegressionForToday && this.linearRegressionForWeekdayAverage)) {
                return null;
            }

            const {slope: todaySlope} = this.linearRegressionForToday;
            const {slope: weekdayAverageSlope} = this.linearRegressionForWeekdayAverage;

            // Resemblance as cosine of slope angle
            // - adjacent: cos(0deg) -> 1 (total resemblance)
            // - normal: cos(90deg) -> 0 (no resemblance)

            // TODO: clean up angle calculation
            const angle = Math.round((slopeAngle(todaySlope, 0) - slopeAngle(weekdayAverageSlope, 0)) * 100) / 100;

            return Math.abs(Math.round(Math.cos(angle) * 100) / 100);
        },
        estimate(): number|null {
            if (!(this.linearRegressionForToday && this.linearRegressionForWeekdayAverage)) {
                return null;
            }

            const {slope: todaySlope, intercept: todayIntercept} = this.linearRegressionForToday;
            const {slope: weekdayAverageSlope} = this.linearRegressionForWeekdayAverage;

            const todayDiffEstimate = Math.max(todaySlope * this.estimationIntervalLength, 0);
            const weekdayAverageDiffEstimate = Math.max(weekdayAverageSlope * this.estimationIntervalLength, 0);

            // When there is no resemblance, today's data is amplified in the
            // estimate, since the weekday average data is not likely a good
            // prediction. Conversely, when there is strong resemblance,
            // the weekday average data is amplified in the estimate, since
            // it is likely a good prediction.

            const diffEstimate = this.resemblance !== null
                ? todayDiffEstimate * (1 - this.resemblance) + weekdayAverageDiffEstimate * this.resemblance
                : todayDiffEstimate;

            return todayIntercept + diffEstimate;
        }
    },
    methods: {
        getLinearRegression(data: number[]): LinearRegressionResult | null {
            const startIndex = this.startIndex;
            const nowIndex = this.nowIndex;

            // Too early after midnight to calculate resemblance.
            if (startIndex < 0) {
                return null;
            }

            // TODO: what to do if either dataset is missing pieces? timestamps need to be synced
            const sampleData = data.slice(startIndex, nowIndex);

            return sampleData.length > 0
                ? linearRegression([...Array(sampleData.length).keys()], sampleData)
                : null;
        },
    }
});
</script>
