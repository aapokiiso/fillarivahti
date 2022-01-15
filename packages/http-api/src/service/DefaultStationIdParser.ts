import { singleton } from 'tsyringe';
import { ParsedQs } from 'qs';
import { StationIdParser } from '../interface/StationIdParser';

@singleton()
export class DefaultStationIdParser implements StationIdParser {
    parse(qs: ParsedQs): string[] {
        const { stationIds } = qs;

        if (Array.isArray(stationIds)) {
            return (stationIds as unknown[])
                .filter(stationId => typeof stationId === 'string') as string[];
        }

        if (typeof stationIds === 'string') {
            return [stationIds];
        }

        return [];
    }
}
