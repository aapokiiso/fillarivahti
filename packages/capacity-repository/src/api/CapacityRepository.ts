import Capacity from './data/Capacity';

interface CapacityRepository
{
    /**
     * Creates a new capacity record.
     *
     * @param Capacity capacity
     *
     * @returns Promise<void>
     */
    create(capacity: Capacity): Promise<void>;
}

export default CapacityRepository;
