import { ParsedQs } from 'qs';

interface StationIdParser
{
    /**
     * Parses station IDs from query string if present.
     *
     * @param ParsedQs qs
     *
     * @returns string[]
     */
    parse(qs: ParsedQs): string[];
}

export default StationIdParser;
