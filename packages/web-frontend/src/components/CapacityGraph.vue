<template>
    <LineChart :chart-data="chartData" :options="options" />
</template>

<script>
import { Chart } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { LineChart } from 'vue-chart-3';
import { defineComponent } from '@vue/composition-api';
import gaussianSmoothen from '~/helpers/gaussian-smoothen';

Chart.register(annotationPlugin);

export default defineComponent({
    components: {
        LineChart,
    },
    props: {
        todayCapacities: {
            type: Array,
            required: true,
        },
        weekdayAverageCapacities: {
            type: Array,
            required: true,
        },
        granularityInMinutes: {
            type: Number,
            default: 5,
        },
        todayColor: {
            type: String,
            default: '#FBB701',
        },
        weekdayAverageColor: {
            type: String,
            default: '#F4F4F5',
        },
        lineThickness: {
            type: Number,
            default: 4,
        },
        fullCapacityValue: {
            type: Number,
            default: 100,
        },
        fullCapacityAnnotationBorderDashScale: {
            type: Number,
            default: 2,
        },
        fullCapacityAnnotationColor: {
            type: String,
            default: '#333',
        },
        topPaddingScale: {
            type: Number,
            default: 0.1,
        },
        aspectRatio: {
            type: Number,
            // eslint-disable-next-line no-magic-numbers
            default: 16 / 9,
        },
    },
    setup (props) {
        /**
         * Pads time unit to 24-hour format.
         * For example 0 -> "00".
         *
         * @param {Number} timeUnit
         * @returns {String}
         */
        function padTimeUnit (timeUnit) {
            const paddedLength = 2;

            return timeUnit.toString().padStart(paddedLength, '0');
        }

        /**
         * Provides "hh:mm" labels for the graph, to be used as the x-axis
         * values.
         *
         * @returns {String[]}
         */
        function getTimeLabels () {
            const hoursInDay = 24;
            const minutesInHour = 60;
            const datapointsCount
                = (hoursInDay * minutesInHour) / props.granularityInMinutes;

            const labels = [];
            for (let i = 0; i < datapointsCount; i++) {
                const nthMinuteOfDay = i * props.granularityInMinutes;

                const hour = Math.floor(nthMinuteOfDay / minutesInHour);
                const minute = nthMinuteOfDay - hour * minutesInHour;

                const hourLabel = padTimeUnit(hour);
                const minuteLabel = padTimeUnit(minute);

                labels.push(`${hourLabel}:${minuteLabel}`);
            }

            return labels;
        }

        function smoothenCapacityRecords (capacityRecords) {
            const smoothenedCapacities = gaussianSmoothen(
                capacityRecords.map(({ capacity }) => capacity),
            );

            return smoothenedCapacities.map(
                (capacity, idx) => ({
                    ...capacityRecords[idx],
                    capacity,
                }),
                [],
            );
        }

        /**
         * Maps a capacity record to a graph point.
         *
         * @param {Capacity} capacityRecord
         * @returns {Point}
         */
        function mapCapacity (capacityRecord) {
            const { timestamp, capacity } = capacityRecord;

            const hour = timestamp.getHours();
            const minute = timestamp.getMinutes();

            const hourLabel = padTimeUnit(hour);
            const minuteLabel = padTimeUnit(minute);

            return {
                x: `${hourLabel}:${minuteLabel}`,
                y: Math.round(capacity * props.fullCapacityValue),
            };
        }

        const chartData = {
            labels: getTimeLabels(),
            datasets: [
                {
                    label: 'Capacity today',
                    data: smoothenCapacityRecords(props.todayCapacities).map(
                        mapCapacity,
                    ),
                    backgroundColor: 'transparent',
                    borderColor: props.todayColor,
                    borderWidth: props.lineThickness,
                    tension: 0.4,
                },
                {
                    label: 'Average capacity for weekday',
                    data: smoothenCapacityRecords(
                        props.weekdayAverageCapacities,
                    ).map(mapCapacity),
                    backgroundColor: props.weekdayAverageColor,
                    borderColor: 'transparent',
                    borderWidth: props.lineThickness,
                    fill: {
                        target: 'origin',
                    },
                    tension: 0.4,
                },
            ],
        };

        const options = {
            responsive: true,
            aspectRatio: props.aspectRatio,
            elements: {
                point: {
                    radius: 0,
                    borderWidth: 0,
                    hitRadius: 0,
                    hoverRadius: 0,
                    hoverBorderWidth: 0,
                },
            },
            scales: {
                x: {
                    display: false,
                    grid: {
                        display: false,
                    },
                },
                y: {
                    display: false,
                    grid: {
                        display: false,
                    },
                    beginAtZero: true,
                    suggestedMax:
                        props.fullCapacityValue
                        + props.fullCapacityValue * props.topPaddingScale,
                },
            },
            plugins: {
                annotation: {
                    annotations: [
                        {
                            id: 'full-capacity',
                            type: 'line',
                            mode: 'horizontal',
                            value: props.fullCapacityValue,
                            scaleID: 'y',
                            drawTime: 'beforeDatasetsDraw',
                            borderColor: props.fullCapacityAnnotationColor,
                            borderWidth: props.lineThickness,
                            borderDash: [
                                props.lineThickness
                                    * props.fullCapacityAnnotationBorderDashScale,
                            ],
                        },
                    ],
                },
            },
        };

        return {
            chartData,
            options,
        };
    },
});
</script>
