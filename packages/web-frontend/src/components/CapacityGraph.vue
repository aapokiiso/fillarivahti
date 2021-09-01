<script>
import { Line } from 'vue-chartjs';
import annotationPlugin from 'chartjs-plugin-annotation';
import gaussianSmoothen from '~/helpers/gaussian-smoothen';

export default {
    extends: Line,
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
            default: '#DDDDDD',
        },
        topPaddingScale: {
            type: Number,
            default: 0.1,
        },
    },
    mounted () {
        this.renderChart(
            {
                labels: this.getTimeLabels(),
                datasets: [
                    {
                        label: 'Capacity today',
                        data: this.smoothenCapacityRecords(this.todayCapacities).map(this.mapCapacity),
                        backgroundColor: 'transparent',
                        borderColor: this.todayColor,
                        borderWidth: this.lineThickness,
                    },
                    {
                        label: 'Average capacity for weekday',
                        data: this.smoothenCapacityRecords(this.weekdayAverageCapacities).map(this.mapCapacity),
                        backgroundColor: this.weekdayAverageColor,
                        borderColor: 'transparent',
                        borderWidth: 0,
                    },
                ],
            },
            {
                plugins: [annotationPlugin],
                legend: {
                    display: false,
                },
                tooltips: {
                    enabled: false,
                },
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
                    xAxes: [
                        {
                            display: false,
                            gridLines: {
                                display: false,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            display: false,
                            gridLines: {
                                display: false,
                            },
                            ticks: {
                                beginAtZero: true,
                                suggestedMax: this.fullCapacityValue + this.fullCapacityValue * this.topPaddingScale,
                            },
                        },
                    ],
                },
                annotation: {
                    annotations: [
                        {
                            id: 'full-capacity',
                            type: 'line',
                            mode: 'horizontal',
                            value: this.fullCapacityValue,
                            scaleID: 'y-axis-0',
                            drawTime: 'beforeDatasetsDraw',
                            borderColor: this.fullCapacityAnnotationColor,
                            borderWidth: this.lineThickness,
                            borderDash: [
                                this.lineThickness * this.fullCapacityAnnotationBorderDashScale,
                            ],
                        },
                    ],
                },
            },
        );
    },
    methods: {
        /**
         * Pads time unit to 24-hour format.
         * For example 0 -> "00".
         *
         * @param {Number} timeUnit
         * @returns {String}
         */
        padTimeUnit (timeUnit) {
            const paddedLength = 2;

            return timeUnit.toString().padStart(paddedLength, '0');
        },
        /**
         * Provides "hh:mm" labels for the graph, to be used as the x-axis
         * values.
         *
         * @returns {String[]}
         */
        getTimeLabels () {
            const hoursInDay = 24;
            const minutesInHour = 60;
            const datapointsCount = (hoursInDay * minutesInHour) / this.granularityInMinutes;

            const labels = [];
            for (let i = 0; i < datapointsCount; i++) {
                const nthMinuteOfDay = i * this.granularityInMinutes;

                const hour = Math.floor(nthMinuteOfDay / minutesInHour);
                const minute = nthMinuteOfDay - hour * minutesInHour;

                const hourLabel = this.padTimeUnit(hour);
                const minuteLabel = this.padTimeUnit(minute);

                labels.push(`${hourLabel}:${minuteLabel}`);
            }

            return labels;
        },
        smoothenCapacityRecords (capacityRecords) {
            const smoothenedCapacities = gaussianSmoothen(
                capacityRecords.map(({ capacity }) => capacity),
            );

            return smoothenedCapacities.map((capacity, idx) => ({
                ...capacityRecords[idx],
                capacity,
            }), []);
        },
        /**
         * Maps a capacity record to a graph point.
         *
         * @param {Capacity} capacityRecord
         * @returns {Point}
         */
        mapCapacity (capacityRecord) {
            const { timestamp, capacity } = capacityRecord;

            const hour = timestamp.getHours();
            const minute = timestamp.getMinutes();

            const hourLabel = this.padTimeUnit(hour);
            const minuteLabel = this.padTimeUnit(minute);

            return {
                x: `${hourLabel}:${minuteLabel}`,
                y: Math.round(capacity * this.fullCapacityValue),
            };
        },
    },
};
</script>
