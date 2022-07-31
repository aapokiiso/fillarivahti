<template>
    <LineChart :chart-data="chartData" :options="options" />
</template>

<script>
import { Chart } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { LineChart } from 'vue-chart-3';
import { defineComponent } from '@vue/composition-api';
import { useWindowSize } from 'vue-window-size';
import { useContext } from '@nuxtjs/composition-api';
import { gaussianSmoothen } from '@aapokiiso/fillarivahti-web-frontend-helpers';

Chart.register(annotationPlugin);

Chart.defaults.font.family = '"Open Sans", sans-serif';
Chart.defaults.font.size = 14;

export default defineComponent({
    components: {
        LineChart,
    },
    props: {
        stationCapacity: {
            type: Number,
            required: true,
        },
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
            default: 'rgb(244, 244, 245, 0.9)',
        },
        tickColor: {
            type: String,
            default: '#333333',
        },
        lineThickness: {
            type: Number,
            default: 4,
        },
        stationCapacityAnnotationBorderDashScale: {
            type: Number,
            default: 2,
        },
        stationCapacityAnnotationColor: {
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
        visibleTimeLabels: {
            type: Array,
            default () {
                return [
                    '00:00',
                    '03:00',
                    '06:00',
                    '09:00',
                    '12:00',
                    '15:00',
                    '18:00',
                    '21:00',
                    '24:00',
                ];
            },
        },
        minWidthLegendVisible: {
            type: Number,
            default: 768,
        },
    },
    setup (props) {
        const { i18n } = useContext();
        const { width: windowWidth } = useWindowSize();

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

        let timeLabels;

        /**
         * Provides "hh:mm" labels for the graph, to be used as the x-axis
         * values.
         *
         * @returns {String[]}
         */
        function getTimeLabels () {
            if (!timeLabels) {
                const hoursInDay = 24;
                const minutesInHour = 60;
                const datapointsCount
                    = (hoursInDay * minutesInHour) / props.granularityInMinutes;

                const labels = [];
                for (let i = 0; i <= datapointsCount; i++) {
                    const nthMinuteOfDay = i * props.granularityInMinutes;

                    const hour = Math.floor(nthMinuteOfDay / minutesInHour);
                    const minute = nthMinuteOfDay - hour * minutesInHour;

                    const hourLabel = padTimeUnit(hour);
                    const minuteLabel = padTimeUnit(minute);

                    labels.push(`${hourLabel}:${minuteLabel}`);
                }

                timeLabels = labels;
            }

            return timeLabels;
        }

        /**
         * Maps time label to an x-axis tick.
         *
         * @param {String} timeLabel
         * @returns {String}
         */
        function mapTimeLabelToTick (timeLabel) {
            const [hour] = timeLabel.split(':');

            return `${parseInt(hour)}h`;
        }

        /**
         * Applies Gaussian smoothing on capacity records which contain quite
         * a bit of noise from people taking and leaving bikes in surges.
         *
         * @param {Capacity[]} capacityRecords
         * @returns {Capacity[]}
         */
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
        function mapCapacityToPoint (capacityRecord) {
            const { timestamp, capacity } = capacityRecord;

            const hour = timestamp.getHours();
            const minute = timestamp.getMinutes();

            const hourLabel = padTimeUnit(hour);
            const minuteLabel = padTimeUnit(minute);

            return {
                x: `${hourLabel}:${minuteLabel}`,
                y: Math.round(capacity * props.stationCapacity),
            };
        }

        const chartData = {
            labels: getTimeLabels(),
            datasets: [
                {
                    label: i18n.t('capacityGraph.todayLegend'),
                    data: smoothenCapacityRecords(props.todayCapacities).map(
                        mapCapacityToPoint,
                    ),
                    backgroundColor: 'transparent',
                    borderColor: props.todayColor,
                    borderWidth: props.lineThickness,
                    tension: 0.4,
                },
                {
                    label: i18n.t('capacityGraph.weekdayAverageLegend', {
                        weekday: i18n.t(
                            `capacityGraph.weekdayForLegend.${new Date().getDay()}`,
                        ),
                    }),
                    data: smoothenCapacityRecords(
                        props.weekdayAverageCapacities,
                    ).map(mapCapacityToPoint),
                    backgroundColor: props.weekdayAverageColor,
                    borderColor: props.weekdayAverageColor,
                    borderWidth: props.lineThickness,
                    fill: {
                        target: 'origin',
                    },
                    tension: 0.4,
                },
                {
                    label: i18n.t('capacityGraph.stationCapacityLegend'),
                    data: [],
                    backgroundColor: 'transparent',
                    borderColor: props.stationCapacityAnnotationColor,
                    borderWidth: props.lineThickness,
                    borderDash: [
                        props.lineThickness
                            * props.stationCapacityAnnotationBorderDashScale,
                    ],
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
                    grid: {
                        display: false,
                        borderColor: 'transparent',
                    },
                    ticks: {
                        color: props.tickColor,
                        maxRotation: 0,
                        autoSkip: false,
                        callback (idx) {
                            const label = getTimeLabels()[idx];

                            return props.visibleTimeLabels.includes(label)
                                ? mapTimeLabelToTick(label)
                                : '';
                        },
                    },
                },
                y: {
                    display: false,
                    grid: {
                        display: false,
                        borderColor: 'transparent',
                    },
                    beginAtZero: true,
                    suggestedMax:
                        props.stationCapacity
                        + props.stationCapacity * props.topPaddingScale,
                },
            },
            plugins: {
                annotation: {
                    annotations: [
                        {
                            id: 'station-capacity',
                            type: 'line',
                            mode: 'horizontal',
                            value: props.stationCapacity,
                            scaleID: 'y',
                            drawTime: 'beforeDatasetsDraw',
                            borderColor: props.stationCapacityAnnotationColor,
                            borderWidth: props.lineThickness,
                            borderDash: [
                                props.lineThickness
                                    * props.stationCapacityAnnotationBorderDashScale,
                            ],
                        },
                    ],
                },
                legend: {
                    display: windowWidth.value >= props.minWidthLegendVisible,
                    position: 'bottom',
                    align: 'end',
                    onClick: null,
                    labels: {
                        padding: 20,
                    },
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
