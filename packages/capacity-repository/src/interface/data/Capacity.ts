export interface Capacity {
    stationId: string;

    timestamp: Date;

    /**
     * Capacity percentage. Values between 0...1. Capacity of 0 means station
     * is empty. Capacity of 1 means station is full.
     */
    capacity: number;
}
