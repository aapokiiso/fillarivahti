import Configuration from '../api/Configuration';
import { DEFAULT_TIME_ZONE, DEFAULT_GRANULARITY_IN_MINUTES } from '../api/Configuration';

export default class EnvConfiguration implements Configuration {
    getTimeZone(): string {
        return process.env.TIME_ZONE || DEFAULT_TIME_ZONE;
    }

    getGranularityInMinutes(): number {
        return process.env.GRANULARITY_IN_MINUTES
            ? Number(process.env.GRANULARITY_IN_MINUTES)
            : DEFAULT_GRANULARITY_IN_MINUTES;
    }
}
