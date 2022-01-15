import { singleton } from 'tsyringe';
import { Configuration } from '../interface/Configuration';
import { DEFAULT_TIME_ZONE, DEFAULT_GRANULARITY_IN_MINUTES } from '../interface/Configuration';

@singleton()
export class EnvConfiguration implements Configuration {
    getTimeZone(): string {
        return process.env.TIME_ZONE || DEFAULT_TIME_ZONE;
    }

    getGranularityInMinutes(): number {
        return process.env.GRANULARITY_IN_MINUTES
            ? Number(process.env.GRANULARITY_IN_MINUTES)
            : DEFAULT_GRANULARITY_IN_MINUTES;
    }
}
