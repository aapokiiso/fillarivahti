import { Response } from 'express';
import { Capacity } from '@aapokiiso/fillarivahti-capacity-repository';

export interface CapacityCacheControlApplier {
    /**
     * Applies a Cache-Control header to the response based on capacity
     * records.
     *
     * @param {Response} response
     * @param {Object} capacitiesByStation
     */
    apply(response: Response, capacitiesByStation: Record<string, Capacity[]>): void;
}
