<script>
import { Line } from 'vue-chartjs';
import annotationPlugin from 'chartjs-plugin-annotation';

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
        lineWidth: {
            type: Number,
            default: 4,
        },
        fullCapacityAnnotationBorderDashScale: {
            type: Number,
            default: 2,
        },
        topPaddingScale: {
            type: Number,
            default: 0.1,
        },
    },
    mounted () {
        this.renderChart(
            {
                labels: this.getLabels(),
                datasets: [
                    {
                        label: 'Capacity today',
                        data: this.todayCapacities.map(this.mapCapacity),
                        backgroundColor: 'transparent',
                        borderColor: '#FBB701',
                        borderWidth: this.lineWidth,
                        pointRadius: 0,
                    },
                    {
                        label: 'Average capacity for weekday',
                        data: this.weekdayAverageCapacities.map(
                            this.mapCapacity,
                        ),
                        backgroundColor: '#F4F4F5',
                        borderColor: 'transparent',
                        borderWidth: 0,
                        pointRadius: 0,
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
                                suggestedMax:
                                    this.getFullCapacityScale()
                                    + this.getFullCapacityScale()
                                        * this.topPaddingScale,
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
                            value: this.getFullCapacityScale(),
                            scaleID: 'y-axis-0',
                            drawTime: 'beforeDatasetsDraw',
                            borderColor: '#F4F4F5',
                            borderWidth: this.lineWidth,
                            borderDash: [
                                this.lineWidth
                                    * this.fullCapacityAnnotationBorderDashScale,
                            ],
                        },
                    ],
                },
            },
        );
    },
    methods: {
        getLabels () {
            const hoursInDay = 24;
            const minutesInHour = 60;
            const datapointsCount
                = (hoursInDay * minutesInHour) / this.granularityInMinutes;

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
        padTimeUnit (timeUnit) {
            const paddedLength = 2;

            return timeUnit.toString().padStart(paddedLength, '0');
        },
        getFullCapacityScale () {
            const percentMultiplier = 100;

            return percentMultiplier;
        },
        mapCapacity (capacityRecord) {
            const { timestamp, capacity } = capacityRecord;

            const hour = timestamp.getHours();
            const minute = timestamp.getMinutes();

            const hourLabel = this.padTimeUnit(hour);
            const minuteLabel = this.padTimeUnit(minute);

            return {
                x: `${hourLabel}:${minuteLabel}`,
                y: Math.round(capacity * this.getFullCapacityScale()),
            };
        },
    },
};
</script>
